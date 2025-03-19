# AI Interview Mocker

![GitHub top language](https://img.shields.io/github/languages/top/Munirab01/AI-Interview-Mocker)
![GitHub](https://img.shields.io/github/license/Munirab01/AI-Interview-Mocker)

## Introduction

AI Interview Mocker is a web-based application designed to help users practice for job interviews by providing AI-generated interview questions and feedback. The application leverages cutting-edge AI technologies to simulate real interview scenarios, helping users to prepare effectively and boost their confidence.

## Features

- **AI-Generated Questions:** Get a variety of interview questions generated by AI.
- **Real-time Feedback:** Receive instant feedback on your answers to improve your performance.
- **Customizable Settings:** Tailor the interview experience to match your specific needs.
- **User-Friendly Interface:** Enjoy a clean and intuitive user interface for a seamless experience.

## Technologies Used

A full-stack AI-powered mock interview app built with Next.js, Tailwind CSS, Drizzle ORM, and PostgreSQL. It uses Gemini AI to simulate real-world interview scenarios, providing instant feedback and personalized insights. Integrated with Clerk for user authentication, offering a seamless and interactive preparation experience for job seekers.

## Flowchart 
```mermaid
graph TB
    User((User))
    
    subgraph "AI Interview Mocker System"
        subgraph "Frontend Container"
            NextApp["Next.js App<br>Next.js 14"]
            
            subgraph "Authentication Components"
                ClerkAuth["Auth Handler<br>Clerk"]
                AuthMiddleware["Auth Middleware<br>Clerk"]
            end
            
            subgraph "Dashboard Components"
                DashHeader["Dashboard Header<br>React"]
                InterviewList["Interview List<br>React"]
                AddNewInterview["Interview Creator<br>React"]
                RecordAnswer["Answer Recorder<br>React"]
                WebcamComponent["Webcam Handler<br>React-Webcam"]
            end
            
            subgraph "Interview Components"
                QuestionsSection["Questions Section<br>React"]
                FeedbackSection["Feedback View<br>React"]
                InterviewCard["Interview Card<br>React"]
            end
            
            subgraph "UI Components"
                Button["Button<br>Shadcn/ui"]
                Dialog["Dialog<br>Shadcn/ui"]
                Input["Input<br>Shadcn/ui"]
                Textarea["Textarea<br>Shadcn/ui"]
                Toast["Toast<br>Shadcn/ui"]
            end
        end
        
        subgraph "Backend Services"
            APIRoutes["API Routes<br>Next.js API"]
            GeminiAI["AI Service<br>Google Gemini AI"]
        end
        
        subgraph "Data Storage"
            NeonDB[("Database<br>NeonDB PostgreSQL")]
            DrizzleORM["ORM Layer<br>Drizzle ORM"]
        end
    end
    
    subgraph "External Services"
        ClerkService["Authentication Service<br>Clerk"]
        GeminiService["Generative AI<br>Google Gemini-1.5"]
    end

    %% Relationships
    User -->|"Accesses"| NextApp
    NextApp -->|"Uses"| ClerkAuth
    ClerkAuth -->|"Validates"| AuthMiddleware
    AuthMiddleware -->|"Authenticates with"| ClerkService
    
    NextApp -->|"Renders"| DashHeader
    DashHeader -->|"Contains"| InterviewList
    InterviewList -->|"Shows"| InterviewCard
    InterviewCard -->|"Uses"| Button
    
    AddNewInterview -->|"Creates"| APIRoutes
    APIRoutes -->|"Stores via"| DrizzleORM
    DrizzleORM -->|"Persists to"| NeonDB
    
    RecordAnswer -->|"Uses"| WebcamComponent
    RecordAnswer -->|"Sends to"| GeminiAI
    GeminiAI -->|"Processes with"| GeminiService
    
    QuestionsSection -->|"Displays in"| Dialog
    FeedbackSection -->|"Shows in"| Toast
    
    APIRoutes -->|"Queries"| DrizzleORM
    GeminiAI -->|"Stores results via"| DrizzleORM
```

## How interview data flows from RecordAnswerSection through the feedback generation process to final storage
```mermaid
graph TD
    subgraph "Frontend Components"
        RecordUI["RecordAnswerSection"]
        WebcamComp["Webcam Component"]
        QuestionsUI["QuestionsSection"]
        FeedbackUI["Feedback Display"]
    end

    subgraph "Authentication & Security"
        Auth["Clerk Auth Middleware"]
        ProtectedRoutes["Protected Route Matcher"]
    end

    subgraph "Core Processing"
        SpeechToText["Speech-to-Text Engine"]
        AIProcessor["Gemini AI Processor"]
        DataValidator["Input Validator"]
    end

    subgraph "Data Storage"
        DB["Neon Database"]
        MockTable["MockInterview Table"]
        AnswerTable["UserAnswer Table"]
    end

    subgraph "State Management"
        InterviewState["Interview Session State"]
        RecordingState["Recording State"]
    end

    %% Core Flow
    RecordUI -->|1. Capture| WebcamComp
    RecordUI -->|2. Record| SpeechToText
    SpeechToText -->|3. Convert| DataValidator
    DataValidator -->|4. Process| AIProcessor
    AIProcessor -->|5. Generate Feedback| AnswerTable

    %% Authentication Flow
    Auth -->|Protect| ProtectedRoutes
    ProtectedRoutes -->|Guard| RecordUI

    %% Data Flow
    MockTable -->|Load Questions| QuestionsUI
    AnswerTable -->|Load Results| FeedbackUI

    %% State Management
    InterviewState -->|Control| QuestionsUI
    RecordingState -->|Manage| RecordUI

    %% Database Operations
    DB -->|Store/Retrieve| MockTable
    DB -->|Store/Retrieve| AnswerTable
```

## Project Structure

```plaintext
AI-Interview-Mocker/
├── .gitignore
├── README.md
├── app/
├── components.json
├── components/
├── drizzle.config.js
├── hooks/
├── jsconfig.json
├── lib/
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
├── tailwind.config.mjs
└── utils/
```

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Munirab01/AI-Interview-Mocker.git
   cd AI-Interview-Mocker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your fork.
4. Create a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to all contributors and the open-source community for their support and contributions.

## Contact

For any inquiries or feedback, please contact [Munira Bhalam](mailto:bhalam.munira@gmail.com).
