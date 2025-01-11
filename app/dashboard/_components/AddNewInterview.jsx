"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


function AddNewInterview() {
    const [openDialog,setOpenDialog]=useState(false);
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExperience,setJobExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [JsonResponse ,setJsonResponse] = useState([]);
    const {user} = useUser();
    const router = useRouter(); 

    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt = "Job Position:"+jobPosition+", Job Description: "+jobDesc+" Years of Experience:"+jobExperience+", depending on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview question with answers in json format , give question and ans as field in json";
        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResponse=(result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResponse));
        setJsonResponse(MockJsonResponse);

        if(MockJsonResponse)
        {
        const resp = await db.insert(MockInterview).values({
          mockId:uuidv4(),
          jsonMockResp:MockJsonResponse,
          jobPosition:jobPosition,
          jobDesc:jobDesc,
          jobExperience:jobExperience,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId});
        console.log("inserted ID:",resp)
        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/'+resp[0]?.mockId);
        }
      }else{
        console.log("ERROR")
      }
        setLoading(false);
      }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary 
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}> 
      <h2 className='font-lg text-lg text-center'>
        + Add New
    </h2>  
    </div>
    <Dialog open={openDialog}>
    
    <DialogContent className='max-w-2xl'>
    <DialogHeader>
    <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
    <DialogDescription>
    </DialogDescription>
        <form onSubmit={onSubmit}>
       <div>
        <h2>Add details about your job position/role</h2>

        <div className='mt-7 my-3'>
            <label >Job Role/Position</label>
            <Input placeholder='Ex. Full Stack Developer' required
            onChange={(event)=>setJobPosition(event.target.value)}
            />
        </div>
        <div className='my-3'>
            <label >Job Description/ Tech Stack (In Short)</label>
            <Textarea placeholder='Ex. React, Angular , Next.js ' required
            onChange={(event)=>setJobDesc(event.target.value)}
            />
        </div>
        <div className='my-3'>
            <label >Years of Experience</label>
            <Textarea placeholder='Ex. 5' type='number' max="50" required
            onChange={(event)=>setJobExperience(event.target.value)}
            />
        </div>
       </div>
        <div className='flex gap-5 justify-end'>
            <Button type='button' variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type='submit' disabled={loading}>
              {loading?
                <>
                <LoaderCircle className='animate-spin'/>Generating from AI </>: 'Start Interview'
              }
              </Button>
        </div>
        </form>
    </DialogHeader>
    </DialogContent>
    </Dialog>

    </div>
  )
}

export default AddNewInterview