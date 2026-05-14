import { useState, type ChangeEvent, type FormEvent } from 'react'
import { FORMSPREE_ID } from '../constants'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </label>

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </label>
      </div>

      <label>
        <span>Subject</span>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Role / Advisory / Collaboration"
          required
        />
      </label>

      <label>
        <span>Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me what you want to build..."
          rows={5}
          required
        />
      </label>

      <button className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message ↗'}
      </button>

      {status === 'success' && <p className="form-success">Message sent — I'll get back to you soon.</p>}
      {status === 'error' && <p className="form-error">Something went wrong. Try emailing directly.</p>}
    </form>
  )
}
