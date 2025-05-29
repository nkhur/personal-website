import '@/styles/pages.css'

export default function AboutPage() {
    return (
      <>
      <div>
        <h2>\ about</h2>
      </div>

      <div>
        <p>
          interested in building tools that make life better, not just faster. & designs that make tech feel alive. <br />
          always curious, always learning, always building. 
          <br /> <br />
          beyond work, i’m usually deep in a playlist, swapping music recs with friends, or watching an f1 race. <br /><br />
        </p>

        <button className="contact-me-button" onClick={() => window.location.href = `mailto:nkhurana@umd.edu`}>say hi!</button>
        <button className="github-button" onClick={() => window.open('https://github.com/nkhur', '_blank')}></button>
        <button className="linkedin-button" onClick={() => window.open('https://linkedin.com/in/navya-khurana', '_blank')}></button>
      </div>
      </>
    )
  }  