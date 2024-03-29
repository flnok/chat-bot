import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteIntentById, getIntentById, updateIntent } from '../../apis';
import { useAuth } from '../../context';
import { formatArray, formatPayload } from '../../util/format';

export default function Intent() {
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [intent, setIntent] = useState({});
  const [responses, setResponses] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);

  useEffect(() => {
    (async function fetchData() {
      const { data, status } = await getIntentById(params.id);
      if (status === 401) {
        auth.logout(() => {
          navigate('/login');
        });
      }
      setIntent(data.data.intent);
      setResponses(data.data.responses);
    })();
    // eslint-disable-next-line
  }, []);

  function DeleteModal() {
    return (
      <Modal show={modalShow} onHide={() => setModalShow(false)} size='lg' centered>
        <Modal.Header closeButton>
          <Modal.Title>Bạn có chắc chắn muốn xóa mẫu này</Modal.Title>
        </Modal.Header>
        <Modal.Body>Xóa sẽ không khôi phục lại được</Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleDelete}>
            Có
          </Button>
          <Button variant='secondary' onClick={() => setModalShow(false)}>
            Không
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const handleDelete = async () => {
    const { status } = await deleteIntentById(params.id);
    if (status === 401) {
      auth.logout(() => {
        navigate('/login');
      });
    }
    navigate(-1);
  };

  function EditModal() {
    const initialState = {
      name: intent?.name || '',
      inContexts: intent?.inContexts?.map(({ name }) => name) || '',
      contexts: intent?.contexts?.map(({ name }) => name) || '',
      event: intent?.event || '',
      trainingPhrases: intent?.trainingPhrases?.map(tp => tp) || '',
      action: intent?.action || '',
      parameters: intent?.parameters?.map(({ key }) => key) || '',
      responses: responses?.text || '',
      payload: responses?.payload || '',
    };
    const [formData, setFormData] = useState(initialState);
    const [validate, setValidate] = useState(null);

    useEffect(() => {
      if (!formData.name) setValidate(true);
      else setValidate(false);
    }, [formData.name]);

    const showValidate = () => {
      return validate === true ? <Alert variant='danger'>Tên không được bỏ trống</Alert> : null;
    };

    return (
      <Modal show={modalEditShow} onHide={() => setModalEditShow(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label className='required'>Tên kịch bản</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
                type='text'
                required
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>InContexts</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, inContexts: e.target.value })}
                value={formData.inContexts}
                type='text'
                placeholder='vd: Booking, Information'
              />
              <Form.Text className='text-muted'>Cách nhau bằng dấu phẩy</Form.Text>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Contexts</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, contexts: e.target.value })}
                value={formData.contexts}
                type='text'
                placeholder='vd: Booking, Information'
              />
              <Form.Text className='text-muted'>Cách nhau bằng dấu phẩy</Form.Text>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Event</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, event: e.target.value })}
                value={formData.event}
                type='text'
                placeholder='vd: Booking, Information'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Training Phrases</Form.Label>
              <Form.Control
                onChange={e =>
                  setFormData({
                    ...formData,
                    trainingPhrases: e.target.value,
                  })
                }
                value={formData.trainingPhrases}
                type='text'
                placeholder='vd: Tôi muốn đặt bàn, xem Menu'
              />
              <Form.Text className='text-muted'>Cách nhau bằng dấu phẩy</Form.Text>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Action</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, action: e.target.value })}
                value={formData.action}
                type='text'
                placeholder='vd: Booking, Information'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Parameters</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, parameters: e.target.value })}
                value={formData.parameters}
                type='text'
                placeholder='vd: date, name, phone, ...'
              />
              <Form.Text className='text-muted'>Cách nhau bằng dấu phẩy</Form.Text>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Responses</Form.Label>
              <Form.Control
                onChange={e => setFormData({ ...formData, responses: e.target.value })}
                value={formData.responses}
                type='text'
                placeholder='vd: Bạn muốn đặt bàn lúc nào?, Chào mừng bạn tới ... '
              />
              <Form.Control
                as='textarea'
                placeholder='Custom payload'
                style={{ height: '100px' }}
                onChange={e => setFormData({ ...formData, payload: e.target.value })}
                value={formData.payload}
              />
              <Form.Text className='text-muted'>Câu trả lời của chatbot</Form.Text>
            </Form.Group>
            {showValidate()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={validate} variant='success' onClick={e => handleEdit(formData)}>
            Cập nhật
          </Button>
          <Button variant='secondary' onClick={() => setModalEditShow(false)}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const handleEdit = async formData => {
    if (!formData) return;

    const update = {
      updateName: formData.name?.trim().toUpperCase(),
      event: formData.event?.trim().toUpperCase(),
      action: formData.action?.trim().toLowerCase(),
      responses: [],
    };
    update.contexts =
      Array.isArray(formData.contexts) && formData.contexts.length > 0
        ? formData.contexts
        : formatArray(formData.contexts);
    update.inContexts =
      Array.isArray(formData.inContexts) && formData.inContexts.length > 0
        ? formData.inContexts
        : formatArray(formData.inContexts);
    update.trainingPhrases =
      Array.isArray(formData.trainingPhrases) && formData.trainingPhrases.length > 0
        ? formData.trainingPhrases
        : formatArray(formData.trainingPhrases);
    update.parameters =
      Array.isArray(formData.parameters) && formData.parameters.length > 0
        ? formData.parameters
        : formatArray(formData.parameters);
    if (Array.isArray(formData.responses) && formData.responses?.length > 0) {
      formData.responses?.map(data =>
        update.responses?.push({
          type: 'text',
          text: data,
        }),
      );
    } else if (typeof formData.responses === 'string') {
      update.responses.push({ type: 'text', text: formData.responses });
    }
    if (Array.isArray(formData.payload) && formData.payload?.length > 0) {
      formData.payload?.map(data => update.responses.push(JSON.parse(data)));
    } else if (typeof formData.payload === 'string' && formData.payload) {
      formatPayload(formData.payload)?.map(data => update.responses.push(data));
    }
    const response = await updateIntent(params.id, update);
    setModalEditShow(false);
    setIntent(response.data.data.intent);
    setResponses(response.data.data.responses);
  };

  return (
    <Container>
      <div className='display-5 text-center mb-3'>
        <span className='text-uppercase'>{intent.name}</span>
      </div>
      <form className='container fs-5' style={{ wordBreak: 'break-word' }}>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Intent name</label>
          <div className='col-8'>
            <div>{intent.name}</div>
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>inContexts</label>
          <div className='col-8'>
            {intent.inContexts?.map(({ name }, index) => {
              return (
                <span key={index} className='me-3 bg-warning'>
                  {name}
                </span>
              );
            })}
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Contexts</label>
          <div className='col-8'>
            {intent.contexts?.map(({ name }, index) => {
              return (
                <span key={index} className='me-3 bg-warning'>
                  {name}
                </span>
              );
            })}
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Event</label>
          <div className='col-8 text-info'>{intent.event}</div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Training Phrases</label>
          <div className='col-8'>
            {intent.trainingPhrases?.map((value, index) => {
              return (
                <span key={index} className='me-3 text-success'>
                  {value}
                </span>
              );
            })}
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Action</label>
          <div className='col-8 text-danger'>{intent.action}</div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Parameters</label>
          <div className='col-8'>
            {intent.parameters?.map(({ key }, index) => {
              return (
                <span key={index} className='me-3'>
                  <span className='me-1 text-primary'>{key}</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Responses</label>
          <div className='col-8'>
            {responses?.text?.map((text, index) => {
              return <div key={index}>{text}</div>;
            })}
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-4 col-form-label'>Payload</label>
          <div className='col-8'>
            <div style={{ whiteSpace: 'break-spaces' }}>
              {responses?.payload?.map((value, index) => {
                return <div key={index}>{JSON.stringify(JSON.parse(value), null, 4)}</div>;
              })}
            </div>
          </div>
        </div>
        <div className='form-group row'>
          <div className='col-6 d-flex g-2 justify-content-around my-3 mx-auto'>
            <Button variant='primary' onClick={() => setModalEditShow(true)}>
              Update
            </Button>
            <Button variant='danger' onClick={() => setModalShow(true)}>
              Delete
            </Button>
            <Button variant='secondary' onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </div>
      </form>

      <DeleteModal />

      <EditModal />
    </Container>
  );
}
