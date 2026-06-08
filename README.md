# Outreach Automation Pipeline

## Overview

This project automates prospect discovery and outreach preparation.

Given a company domain, the pipeline:

* Retrieves company details
* Finds similar companies
* Identifies decision makers
* Retrieves verified email metadata
* Exports prospects into CSV format
* Supports email outreach through Brevo

## Features

* Dynamic domain input
* Company discovery
* Similar company discovery
* Decision maker identification
* Email verification metadata
* CSV export
* Deduplication
* Cache fallback mechanism
* Rate limit handling
* Brevo integration

## Workflow

Domain Input
↓
Company Discovery
↓
Similar Companies
↓
Decision Makers
↓
Email Metadata
↓
CSV Export
↓
Outreach

## Run

```bash
node index.js paypal.com
```

## Technologies Used

* Node.js
* Axios
* Prospeo API
* Ocean.io
* Brevo
* CSV Export
* Git & GitHub
