import Button from '../components/Button'
import Card from '../components/Card'

function Home() {
  return (
    <section className="page">
      <div className="hero">
        <div>
          <span className="eyebrow">Component library</span>
          <h1>Build ideas with React.</h1>
          <p className="lead">
            A clean starter workspace for experimenting with reusable components
            and separate pages.
          </p>
          <div className="button-row">
            <Button>Get started</Button>
            <Button variant="secondary">View components</Button>
          </div>
        </div>
      </div>

      <div className="card-grid">
        <Card icon="C" title="Components" description="Reusable interface pieces such cards and buttons." />
        <Card icon="P" title="Pages" description="Focused views that can be combined in an application." />
        <Card icon="R" title="React" description="A simple starting point for state, props and rendering." />
      </div>
    </section>
  )
}

export default Home
