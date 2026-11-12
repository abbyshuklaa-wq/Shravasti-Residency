import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import {fileURLToPath} from "node:url";
dotenv.config();
const app=express(),dir=path.dirname(fileURLToPath(import.meta.url));
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"20kb"}));
app.use(express.static(path.join(dir,"public")));
app.get("/api/health",(_q,s)=>s.json({ok:true,aiConfigured:!!process.env.OPENAI_API_KEY}));
app.post("/api/review",rateLimit({windowMs:600000,limit:12,standardHeaders:"draft-8",legacyHeaders:false}),async(req,res)=>{
 try{
  const {language="en",rating,liked=[],improve=[],extra=""}=req.body||{};
  if(!Number.isInteger(rating)||rating<1||rating>5)return res.status(400).json({error:"Select a valid 1–5 star rating."});
  if(!Array.isArray(liked)||!Array.isArray(improve)||liked.length>20||improve.length>20||typeof extra!=="string"||extra.length>700)return res.status(400).json({error:"Invalid feedback data."});
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"AI is not configured. Add OPENAI_API_KEY to the server .env file."});
  const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const out=await ai.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-5.5",
   instructions:`Write a concise, natural first-person guest review draft for Shravasti Residency in ${language==="hi"?"Hindi":"English"}. Use ONLY the guest's supplied facts and selections. Never invent facilities, events, staff names, amenities or experiences. Reflect the selected ${rating}/5 rating and include praise and constructive feedback only when selected. Do not turn negative feedback into praise. Avoid advertising language. Output only the review draft, with no heading, hashtags or quotation marks.`,
   input:JSON.stringify({hotel:"Shravasti Residency",rating,liked,improve,additionalNotes:extra})
  });
  const draft=(out.output_text||"").trim();
  if(!draft)return res.status(502).json({error:"AI returned an empty draft. Please try again."});
  res.json({draft});
 }catch(e){console.error("AI review error:",e?.message||e);res.status(500).json({error:"Review generation failed. Please try again."})}
});
app.get("*",(_q,s)=>s.sendFile(path.join(dir,"public","index.html")));
app.listen(process.env.PORT||3000,()=>console.log("Shravasti Residency portal ready"));
