"""End-to-end checks for the published demo, using a local HTTP server."""

import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class SiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        pass


def amount(text):
    return int("".join(re.findall(r"\d", text)))


def check_viewport(browser, base_url, width, height):
    page = browser.new_page(viewport={"width": width, "height": height})
    errors = []
    page.on("pageerror", lambda exception: errors.append(str(exception)))
    try:
        response = page.goto(base_url, wait_until="domcontentloaded")
        assert response and response.ok, f"Page failed to load: {response.status if response else 'no response'}"
        assert page.title().startswith("Delivery Rápido")
        assert page.locator(".restaurant-card").count() == 11
        assert page.get_by_role("heading", name="Mi carrito").is_visible()
        assert not errors, f"Browser JavaScript errors: {errors}"

        # Search must handle a match and the empty state.
        page.locator("#buscador").fill("burger")
        assert page.locator(".restaurant-card").count() == 2
        page.locator("#buscador").fill("sin-resultados-123")
        assert page.locator(".restaurant-card").count() == 0
        assert page.locator("#no-results").is_visible()
        page.locator("#buscador").fill("")
        assert page.locator(".restaurant-card").count() == 11

        assert page.locator("#btn-pagar").is_disabled()
        page.get_by_role("button", name="Agregar Pizza muzzarella al carrito").click()
        assert amount(page.locator("#cart-total").inner_text()) == 3500
        assert page.locator("#cart-count").inner_text() == "1"
        page.get_by_role("button", name="Agregar una unidad de Pizza muzzarella").click()
        assert amount(page.locator("#cart-total").inner_text()) == 7000

        # Cart survives reload, including on a narrow viewport.
        page.reload(wait_until="domcontentloaded")
        assert amount(page.locator("#cart-total").inner_text()) == 7000
        page.get_by_role("button", name="Quitar una unidad de Pizza muzzarella").click()
        assert amount(page.locator("#cart-total").inner_text()) == 3500

        page.locator("#btn-pagar").click()
        assert page.get_by_role("dialog").is_visible()
        assert "3.500" in page.locator("#order-summary").inner_text()
        page.locator("#confirm-demo").click()
        assert page.locator("#order-confirmation").is_visible()
        assert amount(page.locator("#cart-total").inner_text()) == 0
        page.get_by_role("dialog").get_by_role("button", name="Cerrar").click()
        assert not page.get_by_role("dialog").is_visible()

        # Every selected size must be navigable without horizontal overflow.
        document_width = page.evaluate("document.documentElement.scrollWidth")
        assert document_width <= width + 2, (
            f"Horizontal overflow at {width}px: document width {document_width}px"
        )
        assert not errors, f"Browser JavaScript errors: {errors}"
        print(f"Browser checks passed at {width}x{height}")
    finally:
        page.close()


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), SiteHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{server.server_port}/"
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            try:
                check_viewport(browser, url, 1365, 900)
                check_viewport(browser, url, 390, 844)
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
