import data from '../data/content.json';

export default function Contact() {
  return (
    <div className="contact">
      <h1 className="display-5"> {data.contact.content.title}</h1>
      <div>
        <i className="fa fa-map-marker"></i> {data.contact.content.address}
      </div>
      <div>
        <i className="fa fa-envelope-open"></i> {data.contact.content.email}
      </div>
      <div>
        <i className="fa fa-phone"></i> {data.contact.content.phone}
      </div>
      <div>
        <i className="fa fa-clock-o"></i> {data.contact.content.open}
      </div>
      <div className="text-center text-muted noselect p-3">
        © 2022 Copyright: Canh Nguyen-Huu
      </div>
    </div>
  );
}
