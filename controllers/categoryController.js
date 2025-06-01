import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//GET ALL CATEGORIES

export const getAllCategories = async (req,res) => 
{
    try {
        const categories = await prisma.category.findMany()

        res.json(
            {
                "data":categories,
                "msg": "All categories found!!"
            }
        )
    }
    catch (error)
    {
        res.status(500).json({error:"Error finding category"})
    }
};

// FIND CATEGORY BY ID

export const getCategoryById = async (req,res) => 
{
    const { id } = req.params;

    try 
    {
        const category = await prisma.category.findUnique(
            {
                where: {id_category:parseInt(id)},
            }
        )
        if(!category)
        {
            return res.status(404).json({
                error : "Category not found"
            })
        }
        res.json({
            "data":category,
            "msg": "Category found"
            
        })
        
    }catch(error)
    {
        res.status(500).json({error:"Error to find category!"})
    }
}