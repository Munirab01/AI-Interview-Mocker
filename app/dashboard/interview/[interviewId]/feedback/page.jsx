"use client";
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { db } from '@/utils/db';
import { use } from 'react'; // Import React.use for unwrapping promises
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
  const unwrappedParams = use(params); // Unwrap params using React.use
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  useEffect(() => {
    if (unwrappedParams?.interviewId) {
      GetFeedback(unwrappedParams.interviewId);
    }
  }, [unwrappedParams]);

  const GetFeedback = async (interviewId) => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      console.log(result);
      setFeedbackList(result);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-10'>
      
      
      {feedbackList?.length==0?
      <h2 className='font-bold text-xl text-gray-500 '>
        No Interview Record Found
      </h2>
    :
      <>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
      <h2 className='text-primary text-lg my-3'>
        Your Overall interview rating: <strong>7/10</strong>
      </h2>

      <h2 className='text-sm text-gray-500'>
        Find below interview questions with correct answers, your answers, and feedback for improvement
      </h2>

      {loading ? (
        <p className='text-gray-600'>Loading feedback...</p>
      ) : feedbackList.length > 0 ? (
        feedbackList.map((item, index) => (
          <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left justify-between
            w-full gap-7'>
              {item.question} <ChevronsUpDown className='h-5 w-5' />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'>
                  <strong>Rating:</strong> {item.rating}
                </h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-600'>
                  <strong>Your Answer:</strong> {item.userAns}
                </h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-600'>
                  <strong>Correct Answer:</strong> {item.correctAns}
                </h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-600'>
                  <strong>Feedback:</strong> {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p className='text-gray-600'>No feedback available for this interview.</p>
      )}

</>} 
      <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
    </div>
  );
}

export default Feedback;
