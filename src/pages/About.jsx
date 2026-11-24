import Card from '../components/Card'

function About() {
  return (
    <section className="page">
      <span className="eyebrow">About</span>
      <h1>Small pieces. Big ideas.</h1>
      <p className="page-copy">
        This example separates screens into pages and shared interface elements
        into components, making each part easier to understand and maintain.
      </p>
      <div className="card-grid">
        <Card icon="1" title="Organized" description="A clear folder structure for growing projects." />
        <Card icon="2" title="Reusable" description="Components that accept props and work in many places." />
        <Card icon="3" title="Readable" description="Small files with focused responsibilities." />
      </div>
    </section>
  )
}

export default About
