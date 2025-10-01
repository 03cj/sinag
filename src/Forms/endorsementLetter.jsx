// src/EndorsementLetter.js
import React from "react";

const EndorsementLetter = React.forwardRef(
  ({ supervisor, company, students, startDate }, ref) => (
    <div ref={ref} className="p-8 text-justify leading-relaxed text-sm">
      <h2 className="text-center font-bold">REPUBLIC OF THE PHILIPPINES</h2>
      <h3 className="text-center">POLYTECHNIC UNIVERSITY OF THE PHILIPPINES</h3>
      <h4 className="text-center mb-6">Mariveles, Bataan Campus</h4>

      {/* Convert the date to a more readable format, e.g., "July 22, 2024" */}
      <p className="mb-4">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        {supervisor} <br />
        {company.position} <br />
        {company.name} <br />
        {company.address}
      </p>

      {/* Split the supervisor's name to get the first name */}
      <p className="mt-4">Dear {supervisor.split(" ")[0]},</p>

      <p className="mt-4">
        Warmest greetings!
        <br />
       The Internship course of Bachelor of Science in Entrepreneurship program aims to provide hands-on experience and 
       opportunities exposing them to a real-world work environment to develop specific skills related to their field of study. 
       Moreover, developing professional competencies such as, but not limited to, communication, teamwork, and time 
       management can be further attained through skills development and professional experience.


</p>

<p>
  With this, may we respectfully endorse our student-intern/s enrolled in this course to undergo On-the-Job Training/Internship for 400 Hours in your company through Face-to-Face Modality. Consequently, he/she is expected to exhibit skills and competencies in the following: 
</p>

<ul className="list-disc list-inside">
  <li>Prepare industry or sector analysis and discussion of business opportunities.</li>
  <li>Prepare production and operations plan.</li>
  <li>Prepare financial plan with capital budget, master budget, five-year projects and formal income statements</li>
  <li>Apply entrepreneurial management in any organization other than your own enterprise.</li>
  <li>Apply information and communication technology skills as required by the business environment.</li>
  <li>Exercise high personal moral and ethical standards.</li>
</ul>

      <p className="mt-4">Below is/are the student-intern/s:</p>
      <ul className="list-disc list-inside">
        {students.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <p className="mt-4">
        The student-intern/s will report physically beginning **{new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}**,
        from Monday to Friday, 8:00 a.m. to 5:00 p.m., until they accomplish the
        required number of hours.
      </p>

      <p className="mt-6">Very truly yours,</p>

      <p className="mt-6">NAME M. NAME <br /> OJT Adviser</p>

      <p className="mt-8">Noted by:</p>
      <p>
        Asst. Prof. BENJIE M. MANILA, EdD <br /> OJT Coordinator
      </p>
      <p>
        Assoc. Prof. RUBY JEAN S. MEDINA <br /> Head, Academic Program
      </p>
      <p>
        Dr. RUFO N. BUEZA <br /> Director
      </p>
    </div>
  )
);

export default EndorsementLetter;