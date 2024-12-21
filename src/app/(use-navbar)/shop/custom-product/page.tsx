
import {Hero} from "./components/hero";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
export default async function Page() {
    const models=await  prisma.model.findMany({
        select:{
            id:true,
            description:true,
            image:true,
            model:true
        }
    });
    const bahans= await  prisma.material.findMany({
        select:{
            id:true,
            name:true,
            description:true,
            price:true,
            supplier_price:true
        }
    })
      
    if (!models) return notFound();
    return <Hero models={models } bahans={bahans} />;
}