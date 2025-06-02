import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (req,res) => 
{
    const {id_user,id_category,type,value, date_of_transaction} = req.body;

    
    
    try {
        // checking if it is a real category
        const category = await prisma.category.findUnique({
            where:{id_category:parseInt(id_category)}
        })
        if(!category)
        {
            return res.status(400).json({
                error:"You should provide a valid category ID"
            });
        }

        const user = await prisma.users.findUnique
        ({
            where: {id_user:parseInt(id_user)}
        })
        if(!user)
        {
            return res.status(400).json({error:"Invalid user id"})
        }

        const correctTypes = ['earnings','outgoings']
        if(!correctTypes.includes(type)){
            return res.status(400).json({error:"Invalid type"})
        }

        const transaction = await prisma.transactions.create
        ({
            data: {
                id_user: parseInt(id_user),
                id_category: parseInt(id_category),
                type,
                // Using prisma decimal  because we need precise values (money)
                value: new Prisma.Decimal(value),
                date_of_transaction: new Date(date_of_transaction)
            }
        })
        res.status(201).json
        ({
            data:transaction,
            msg:"Transaction posted with success!"
        })

    }catch(error)
    {
        res.status(500).json({error:'Failed to create the transaction!'})
    }
    
    
}