import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function Error(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (props.isError) handleShow();
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Có lỗi xảy ra</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.error}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
