function Card({ icon, title, description }) {
  return (
    <article className="card">
      <div className="card-icon" aria-hidden="true">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}

export default Card
