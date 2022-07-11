export default function Footer(props) {
  return (
    <div className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">Nhà hàng Thuận Phát</h5>
            <div>
              Địa chỉ:{' '}
              <span>
                30 Tô Hiến Thành, thị trấn Liên Nghĩa, huyện Đức Trọng, tỉnh Lâm
                Đồng
              </span>
            </div>
            <div>
              Điện thoại: <span>09 999 789 68</span>
            </div>
            <div>
              Email: <span>abc@gmail.com</span>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0 text-end">
            <h5 className="text-uppercase">
              <i className="fa-solid fa-phone"></i> 09 999 789 68
            </h5>
            <div>Giờ hoạt động</div>
            <div>08:00 - 22:00 (T2-CN)</div>
          </div>
        </div>
      </div>
      <div className="text-center text-muted noselect p-3 bg-light bg-gradient">
        © 2022 Copyright: Canh Nguyen-Huu
      </div>
    </div>
  );
}
