# ai-caller-mvp
AI Auto Caller MVP – A system that automatically calls leads and forwards answered calls to sales agents. Built with Node.js, React, MongoDB, and Twilio. Supports CSV lead import, automated dialing, call transfer, and basic call logs.
📞 AI Auto Caller MVP

An MVP system for automatic lead calling with real-time call transfer to sales agents.
Built with Node.js + Express + MongoDB + React + Twilio.

🚀 Features
	•	CSV Lead Import → Admin can upload phone numbers from a CSV file.
	•	Automated Calling → System dials leads one by one using Twilio.
	•	Smart Call Flow
	•	If lead answers → Call is instantly forwarded to a sales agent.
	•	If lead does not answer → System waits 30s and moves to the next lead.
	•	Seller Management → Sales agents can register/login and receive forwarded calls.
	•	Call Logs → Every attempt is stored (answered / no answer / transferred).
	•	Real-Time → WebSocket support for live updates (Socket.io ready).

🛠️ Tech Stack
	•	Frontend: React.js (CSV upload, login, call logs UI)
	•	Backend: Node.js + Express
	•	Database: MongoDB (lead storage + call logs)
	•	Telephony: Twilio Programmable Voice (MVP telephony engine)
	•	Real-Time: Socket.io (live logs & status)
	•	Deploy: Heroku / Vercel / DigitalOcean
