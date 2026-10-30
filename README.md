# HairAlly

A free, evidence-labelled guide to hair fall, early greying, and scalp care.
Built to help people understand their hair problem before spending money.

**Live site:** https://hairally.in

## Features

- **Symptom checker:** a rule-based tool with weighted scoring across likely causes, conditional questions, and red-flag alerts that point to a doctor.
- **Personalised tips:** advice filtered by diet, place (city, town, village), and budget, sorted cheapest first.
- **Learn pages:** hair fall, greying, and dandruff, with each claim labelled as well supported, limited evidence, or little evidence.
- **15-day tracker:** daily shedding log with a trend chart, edit, delete, and export.
- **Privacy-first:** all data stays in the browser.

## Tech

React, Vite, React Router, Recharts, plain CSS. Hosted on Vercel.

## How the checker works

Each answer adds points to possible causes (a map of cause to score). Questions
appear or hide based on earlier answers. The top three causes are shown, and
red-flag answers are collected separately. All questions, scores, and tips live
in `src/data`, so content can be edited without touching page code.

## Run locally

    npm install
    npm run dev

## Disclaimer

Educational information only. Not medical advice. The questions and scores
are a draft and have not been clinically reviewed.

## Contact

Feedback and data requests: feedbackhere@hairally.in