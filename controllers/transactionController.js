import { PrismaClient ,Prisma  } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (req,res) => 
{
    const {id_user,id_category,type,value, date_of_transaction,description} = req.body;

    if(!id_user||!id_category||!type||!value||!date_of_transaction||!description)
    {
        return res.status(400).json({message:"You must provide: User_id, id_category, type, value , date_of transaction,description"})
    }

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

        const decimalValue = new Prisma.Decimal(value)

        if(type === "outgoings" && decimalValue.gt(user.balance)){
            return res.status(400).json({message:"You dont have enough money!"})
        }

        const transaction = await prisma.transactions.create
        ({
            data: {
                id_user: parseInt(id_user),
                id_category: parseInt(id_category),
                type,
                // Using prisma decimal  because we need precise values (money)
                value: decimalValue,
                date_of_transaction: new Date(date_of_transaction),
                description:description
            }
        })

        let changeMoney = 0

        if (type === 'earnings')
        {
            changeMoney = user.balance.add(decimalValue)
        }else if ( type === 'outgoings' )
        {
            changeMoney = user.balance.sub(decimalValue)
        }

        await prisma.users.update
        ({
            where: {id_user: parseInt(id_user)},
            data: {balance:changeMoney}
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

export const getAllTransactions = async (req,res) =>
{
    try 
    {
        const { id_user, type, category, start, end } = req.query;

        if (!id_user)
        {
            return res.status(400).json({message:"You need to provide the user ID"})
        }
        
        const filters = {}

        filters.id_user = parseInt(id_user)
        
        if(type)
        {
            filters.type = type;
        }

        if(category)
        {
            filters.category = {
                name:category
            }
        }

        if(start && end)
        {
            filters.date_of_transaction = 
            {
                gte: new Date(start),
                lte: new Date(end)
            }
        }

        const transactions = await prisma.transactions.findMany
        ({
            where:filters,
            select:{
                id_transaction: true,
                id_user: true,
                id_category: true,
                type: true,
                value: true,
                date_of_transaction: true,
                description: true,
                category: true,
                users: true
            },
            orderBy:{
                date_of_transaction:"desc"
            }
        })
        res.json
        ({
            message:"All transactions found",
            data:transactions
        })

    }
    catch(error)
    {
        res.status(500).json({error:"Error while finding the transactions!!"})
    }
}

export const getTransactionById = async (req,res) => 
{
    const {id} = req.params;

    if(!id)
    {
        return res.status(400).json({message:"Provide the ID"})
    }

    try{
        const transaction = await prisma.transactions.findUnique
        ({
            where:{id_transaction:parseInt(id)},
            select:{id_transaction:true,
                id_user:true,
                id_category:true,
                type:true,
                value:true,
                date_of_transaction:true,
                description:true,
                category:true,
                users:true}
        })

        if(!transaction)
        {
            return res.status(404).json({message:"Transaction not found"})
        }

        res.json
        ({
            data:transaction,
            message:"Transaction found with sucess!" 
        })
    }
    catch(error)
    {
        res.status(500).json({error:"Error finding the transaction"})
    }
}

export const updateTransaction = async (req,res) =>
{
    const {id} = req.params;
    const {id_category, type, value, date_of_transaction, description } = req.body;

    if (!id)
    {
        return res.status(400).json({message:"You must provide the transaction ID"})
    }

    try 
    {
        const transaction = await prisma.transactions.findUnique
        ({
            where:{id_transaction:parseInt(id)}
        })

        if(!transaction)
        {
            return res.status(404).json({message:"Transaction not found!"})
        }

        const user = await prisma.users.findUnique
        ({
            where:{id_user:parseInt(transaction.id_user)}
        })

        if(!user)
        {
            return res.status(404).json({message:"User not found"})
        }

        const dataToUpdate = {}

        if(id_category)
        {
            const category = await prisma.category.findUnique
            ({
                where:{id_category:parseInt(id_category)}
            })
            if(!category)
            {
                return res.status(400).json({message:"Invalid category ID"})
            }

            dataToUpdate.id_category = parseInt(id_category)
        }

        if (type) {
            const correctTypes = ['earnings', 'outgoings'];

            if (!correctTypes.includes(type)) {

                return res.status(400).json({ message: "Invalid transaction type" });
            }
            dataToUpdate.type = type;
        }

        if(value)
        {
            const decimalValue = new Prisma.Decimal(value);
            dataToUpdate.value = decimalValue;
        }

        if(date_of_transaction)
        {
            dataToUpdate.date_of_transaction = new Date(date_of_transaction)
        }

        if(description)
        {
            dataToUpdate.description = description;
        }

        let updatedBalance = user.balance;

        const oldValue = transaction.value

        const oldType = transaction.type
        // setting new type with old type , because if the user pass on body the type i'll just change it
        let newType = oldType

        if (dataToUpdate.type)
        {
            newType = dataToUpdate.type
        }

        let newValue = oldValue;

        if (dataToUpdate.value) {
            newValue = dataToUpdate.value;
        }

        if(dataToUpdate.value || dataToUpdate.type)
        {
            if(oldType === "earnings" )
            {
                updatedBalance = updatedBalance.sub(oldValue)
            }
            else if (oldType === 'outgoings')
            {
                updatedBalance =updatedBalance.add(oldValue)
            }
        }

        if (newType === 'earnings')
        {
            updatedBalance = updatedBalance.add(newValue)
        }
        else if (newType === 'outgoings')
        {
            if (newValue.gt(updatedBalance))
            {
                return res.status(400).json({message:"You dont have enough money "})
            }
            updatedBalance = updatedBalance.sub(newValue);
        }

        const updatedTransaction = await prisma.transactions.update
        ({
            where:{id_transaction:parseInt(id)},
            data:dataToUpdate
        })

        await prisma.users.update
        ({
            where:{id_user:user.id_user},
            data:{balance:updatedBalance}
        })

        res.status(200).json({
            message: "updated successfully",
            data: updatedTransaction
        })

    }
    catch(error)
    {
        res.status(500).json({error:"Error while updating the transaction"})

    }
    
    
}

export const deleteTransaction = async (req,res) =>
{
    const {id} = req.params

    if(!id)
    {
        return res.status(400).json({message:"You must provide the ID"})
    }

    try 
    {
        const transaction = await prisma.transactions.findUnique({
            where: {id_transaction:parseInt(id)}
        })

        if(!transaction)
        {
            return res.status(404).json({message:"Transaction not found!"})
        }

        const user = await prisma.users.findUnique({
    where: { id_user: transaction.id_user }
})

        if(!user)
        {
            return res.status(404).json({message:"user not found!"})
        }

        let updatedBalance = user.balance;

        if ( transaction.type === "earnings"  ) {
            updatedBalance = updatedBalance.sub( transaction.value);
        } else if ( transaction.type === "outgoings") {
            updatedBalance = updatedBalance.add( transaction.value);
        }

        await prisma.transactions.delete
        ({
            where:{id_transaction:parseInt(id)}
        })

        await prisma.users.update({
            where:{id_user:transaction.id_user},
            data:{balance:updatedBalance}
        })

        return res.status(200).json({
            message:"Transaction deleted with sucess!",
            data:{
                balance:updatedBalance
            }
        })

    }
    catch(error)
    {
        return res.status(500).json({error: "Error while deleting the transaction"});
    }
}