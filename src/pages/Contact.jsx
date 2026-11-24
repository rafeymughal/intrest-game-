import Button from '../components/Button'

function Contact() {
  return (
    <section className="page">
      <span className="eyebrow">Contact</span>
      <h1>Let&apos;s talk.</h1>
      <p className="page-copy">Send a note using this example contact form.</p>
      <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
        <input aria-label="Name" name="name" placeholder="Your name" required />
        <input aria-label="Email" name="email" type="email" placeholder="Email address" required />
        <textarea aria-label="Message" name="message" placeholder="Your message" required />
        <Button type="submit">Send message</Button>
      </form>
    </section>
  )
}

export default Contact
