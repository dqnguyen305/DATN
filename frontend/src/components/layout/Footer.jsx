function Footer() {
  return (
    <footer
      className="bg-dark text-light mt-5"
    >
      <div className="container py-4">

        <div className="row">

          <div className="col-md-4 mb-3">
            <h5>📚 BookStore</h5>
            <p className="mb-0">
              Website bán sách trực tuyến tích hợp AI hỗ trợ tư vấn và gợi ý sách.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>Liên kết nhanh</h5>

            <div className="d-flex flex-column gap-2">
              <a
                href="/"
                className="text-light text-decoration-none"
              >
                Trang chủ
              </a>

              <a
                href="/cart"
                className="text-light text-decoration-none"
              >
                Giỏ hàng
              </a>

              <a
                href="/orders"
                className="text-light text-decoration-none"
              >
                Đơn hàng
              </a>
            </div>

          </div>

          <div className="col-md-4">
            <h5>Liên hệ</h5>

            <p className="mb-1">
              📧 Email: bookstore@gmail.com
            </p>

            <p className="mb-1">
              📞 Hotline: 0919696431
            </p>

            <p className="mb-0">
              📍 Hà Nội, Việt Nam
            </p>
          </div>

        </div>

        <hr />

        <div className="text-center">
          © 2026 BookStore - Đồ án tốt nghiệp Đinh Quốc Nguyên
        </div>

      </div>
    </footer>
  );
}

export default Footer;