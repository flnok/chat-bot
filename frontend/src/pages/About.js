import data from '../data/content.json';

export default function About() {
  return (
    <div className="about" style={{ whiteSpace: 'break-spaces' }}>
      <h1 className="display-5">{data.about.title}</h1>
      <dl>
        <dt>Sứ mệnh</dt>
        <dd>{data.about.content['Sứ mệnh']}</dd>
        <dt>Tầm nhìn</dt>
        <dd>{data.about.content['Tầm nhìn']}</dd>
        <dt>Giá trị cốt lõi</dt>
        <dd>{data.about.content['Giá trị cốt lõi']}</dd>
      </dl>
    </div>
  );
}
