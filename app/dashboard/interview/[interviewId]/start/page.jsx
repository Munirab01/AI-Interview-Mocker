"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from '@/app/dashboard/_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { use } from 'react'; // Import React.use for unwrapping promises

function StartInterview({ params }) {
    const unwrappedParams = use(params); // Unwrap params using React.use
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQues, setMockInterviewQues] = useState();
    const [activeQuesIndex, setActiveQuesIndex] = useState(0);

    useEffect(() => {
        if (unwrappedParams?.interviewId) {
            setInterviewData(unwrappedParams.interviewId);
            getInterviewDetails(unwrappedParams.interviewId);
        }
    }, [unwrappedParams]);

    const getInterviewDetails = async (id) => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, id));

        if (result.length > 0) {
            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setMockInterviewQues(jsonMockResp);
            setInterviewData(result[0]);
        }
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <QuestionsSection
                mockInterviewQues={mockInterviewQues}
                activeQuestionIndex={activeQuesIndex}
            />

            <RecordAnswerSection
                mockInterviewQues={mockInterviewQues}
                activeQuestionIndex={activeQuesIndex}
                interviewData={interviewData}
            />

            <div className='flex justify-end gap-6'>
                {activeQuesIndex > 0 && (
                    <Button onClick={() => setActiveQuesIndex(activeQuesIndex - 1)}>
                        Previous Question
                    </Button>
                )}

                {activeQuesIndex !== mockInterviewQues?.length - 1 && (
                    <Button onClick={() => setActiveQuesIndex(activeQuesIndex + 1)}>
                        Next Question
                    </Button>
                )}

                {activeQuesIndex === mockInterviewQues?.length - 1 && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
