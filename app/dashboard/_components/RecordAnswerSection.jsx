"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic } from 'lucide-react'
import { chatSession } from '@/utils/GeminiAIModal'
import { UserAnswer } from '@/utils/schema'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import { ToastContainer, toast } from 'react-toastify' // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'  // Import styles

function RecordAnswerSection({mockInterviewQues, activeQuestionIndex, interviewData}) {

    const { user } = useUser();
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
     
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => (
            setUserAnswer(prevAns => prevAns + result?.transcript)
        ));
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
          UpdateUserAnswer();
        } else if (!isRecording  && userAnswer.length < 10 && userAnswer.length>0) {
          setLoading(false);
          toast.error('Error while saving your answer. Please record again.');
        }
      }, [userAnswer, isRecording]);

    const StartStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const UpdateUserAnswer = async () => {
        console.log(userAnswer);
        setLoading(true);
        const feedbackPrompt = "Question:" + mockInterviewQues[activeQuestionIndex]?.question +
            ",User Answer:" + userAnswer + ",Depends on question and user answer for given interview question. " +
            "Please give us rating for answer and feedback as area for improvement, if any, " +
            "in 3 to 5 lines to improve it in JSON format with rating field and feedback field";

        const result = await chatSession.sendMessage(feedbackPrompt);

        const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
        console.log(mockJsonResp);
        const jsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: mockInterviewQues[activeQuestionIndex]?.question,
            correctAns: mockInterviewQues[activeQuestionIndex]?.answer,
            userAns: userAnswer,
            feedback: jsonFeedbackResp?.feedback,
            rating: jsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy'),
        });

        if (resp) {
            toast.success("User Answer recorded Successfully!"); // Success toast
        }
        setUserAnswer('');
        setLoading(false);
    };

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col my-20 justify-center items-center bg-white rounded-lg p-5'>
                <Image src={"/images.png"} alt="Placeholder image" width={200} height={200} className='absolute'/>
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10, 
                    }}
                />
            </div>
            <Button 
                disabled={loading}
                variant="outline" className='my-10'
                onClick={StartStopRecording}
            >
                { 
                    isRecording ? 
                        <h2 className='text-red-600 flex gap-2'>
                            <Mic/> Stop Recording....
                        </h2> :
                        'Record Answer' 
                }
            </Button>
            <ToastContainer /> {/* This component renders all toast messages */}
        </div>
    );
}

export default RecordAnswerSection;
