import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import generateToken from './../utils/jwt.js';

const prisma = new PrismaClient();

// CONTROLLERS - get all users / get user by id / create / update / delete / login 

export const getAllUsers = async (req,res) => 
{
    try 
    {
        const users = await prisma.users.findMany
        ({
            // i dont need the password so i'll use true to ensure this
            select:{id_user:true, name:true, date_of_birth:true,balance:true}
        })
        res.json
        ({
            data:users
        })
    }
    catch(error)
    {
        res.status(500).json({error:"Error getting the users"})
    }
}

export const getUserById = async (req,res) =>
{
    const {id} = req.params;

    if(!id)
    {
        return res.status(400).json({message:"Provide the ID"})
    }

    try 
    {
        const user = await prisma.users.findUnique
        ({
            where:{id_user: parseInt(id)},
            select:{id_user:true, name:true, date_of_birth:true,balance:true}
        });
        // checking the user

        if(!user)
        {
            return res.status(404).json({
                error: 'User not found'
            })
        }
        res.json
        ({
            data:user,
            message: "User found with success!"
        })
    }
    catch(error)
    {
        res.status(500).json({error:"Error finding the user"})
    }
}

export const createUser = async (req,res) =>
{
    const {name,password,date_of_birth} = req.body;

    if (!name||!password||!date_of_birth)
    {
        return res.status(400).json({message:"You need to provide : Name , password and date of birth "})
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.users.create
        ({
            data: {
                name: name,
                password: hashedPassword,
                date_of_birth: new Date(date_of_birth),
                // default is zero
                balance:0
            }
        })
        const token =  generateToken(user)

        res.status(201).json
        ({
            data: {
                id_user: user.id_user,
                name: user.name,
                date_of_birth: user.date_of_birth,
                balance: user.balance
            }, 
            token: token,
            message:"User created successfully"
        })
    }
    catch(error)
    {
        res.status(500).json({
            error:"Error creating the user"
        })
    }
}

export const updateUser = async (req,res) => 
{
    const {id} = req.params;
    const {name,password,date_of_birth} = req.body;
    // with this we can update just we get from the body 
    

    if(!id)
    {
        return res.status(400).json({
            message:"Need to provide the ID"
        })
    }

    try
    {
        const dataToUpdate = {}
    
        if(name)
        {
            dataToUpdate.name = name
        }
        if (password)
        {
            dataToUpdate.password = await bcrypt.hash(password,10)
        }
        if (date_of_birth)
        {
            dataToUpdate.date_of_birth = new Date(date_of_birth)
        }

        // we need to check if the user provide something in the body so lets use the lenght
        if (Object.keys(dataToUpdate).length === 0)
        {
            return res.status(400).json
            ({
                error:"You need to provide something to update"
            })
        }
        const updatedUser = await prisma.users.update
        ({
            where:{id_user: parseInt(id)},
            data:dataToUpdate
        })
        res.json
        ({
            data: {
                id_user: updatedUser.id_user,
                name: updatedUser.name,
                date_of_birth: updatedUser.date_of_birth,
                balance: updatedUser.balance
            },
            message:"User updated successfully"
        })
    }
    catch(error)
    {
        res.status(500).json({error:"Error while updating the user"})
    }

}

export const deleteUser = async (req,res) => 
{
    const {id} = req.params

    if(!id)
    {
        return res.status(400).json({
            message:"Need to provide the ID"
        })
    }

    try
    {
        await prisma.users.delete
        ({
            where:{id_user: parseInt(id)}
        })
        res.json({message:"User deleted successfully"})
    }
    catch(error)
    {
        res.status(500).json({error:"error while deleting the user"})
    }
}

export const loginUser = async (req,res) =>
{
    const {name,password} = req.body;

    if(!name||!password)
    {
        return res.status(400).json({message:"You need to provide : Name , password "})
    }

    try 
    {
        const user = await prisma.users.findUnique
        ({
            where: {name:name}
        })

        if(!user)
        {
            return res.status(401).json({error:"Can't find this name"})
        }

        const passwordCompare = await bcrypt.compare(password,user.password)

        if (!passwordCompare)
        {
            return res.status(401).json({
                error:"Invalid password"
            })
        }

        const token = generateToken(user)

        res.json
        ({
            data: {
                id_user: user.id_user,
                name: user.name,
                date_of_birth: user.date_of_birth,
                balance: user.balance
            },
            token:token,
            message:"Login sucessful"
        })

    }catch(error)
    {
        res.status(500).json({error:"Error while login"})
    }

}