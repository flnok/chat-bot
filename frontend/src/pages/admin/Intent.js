import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import { useState, useEffect } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';

export default function Intent() {
  const [intent, setIntent] = useState(null);
  const auth = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const intent = await axios.get(`/api/chatbot/intent/${params.id}`);
        setIntent(intent.data);
      } catch (error) {
        if (error.response.status === 401) {
          auth.logout(() => {
            navigate('/login');
          });
        }
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/chatbot/intent/${params.id}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  function renderIntent(intent) {
    if (intent) {
      return (
        <>
          <div className="display-5 text-center mb-3">
            <span className="text-uppercase">{intent.name}</span>
          </div>

          <form>
            <div className="form-group row">
              <label className="col-4 col-form-label">Intent name</label>
              <div className="col-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  value={intent.name}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Context</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.contexts?.map(({ name }) => {
                    return `Name: ${name}\n`;
                  })}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Event</label>
              <div className="col-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  value={intent.event}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Training Phrases</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.trainingPhrases?.map((value) => value + '\n')}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Action</label>
              <div className="col-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  value={intent.action}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Parameters</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.parameters?.map((value) => value + '\n')}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4 col-form-label">Responses</label>
              <div className="col-8">
                <div style={{ whiteSpace: 'break-spaces' }}>
                  {intent.responses?.map((value) => value + '\n')}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-6 d-flex g-2 justify-content-around my-3 mx-auto">
                <Button variant="primary" type="submit">
                  Update
                </Button>
                <Button variant="danger" onClick={() => setModalShow(true)}>
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Go back
                </Button>
              </div>
            </div>
          </form>

          <ConfirmDelete
            show={modalShow}
            handleDelete={handleDelete}
            onHide={() => setModalShow(false)}
          />
        </>
      );
    }
    return null;
  }

  return <Container>{renderIntent(intent)}</Container>;
}

function ConfirmDelete(props) {
  return (
    <Modal show={props.show} onHide={props.onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bạn có chắc chắn muốn xóa mẫu này</Modal.Title>
      </Modal.Header>
      <Modal.Body>Xóa sẽ không khôi phục lại được</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.handleDelete}>
          Có
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Không
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
