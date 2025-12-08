import React, { useState } from 'react'

const Todo = () => {
    const [todos, setTodos] = useState([])
    const [input, setInput] = useState("")

    const addTodo = () => {
        if (input.trim()) {
            setTodos([...todos, { id: Date.now(), text: input }])
            setInput('')
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-r from-blue-600 to-emerald-400'>
            <div className='bg-white shadow-lg rounded-3xl p-16'>
                <h1 className='text-3xl font-bold text-center text-gray-900 mb-6'>Todo List App</h1>
                <div className='mb-4 flex'>
                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder='Enter new task.' className='px-3 py-2 border border-gray-400 rounded-l-lg outline-none' />
                    <button onClick={addTodo} className='px-3 py-2 border border-gray-400 rounded-r-lg bg-blue-700 text-white cursor-pointer'>Submit</button>
                </div>

                <ol className='space-y-2'>
                    {
                        todos.map((todo, index) => (
                            <li key={todo.id} className='flex items-center rounded-lg bg-slate-100 border border-gray-400'>
                                {/* Show the number manually since flex layout might hide it */}
                                <span className='min-w-[30px] text-center font-semibold pl-2 text-gray-600'>{index + 1}.</span>
                                <h2 className='flex-1 text-gray-800 font-semibold p-2'>{todo.text}</h2>
                                <button onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))} className='px-3 py-2 border border-gray-400 rounded-r-lg bg-red-700 text-white cursor-pointer'>Delete</button>
                            </li>
                        ))
                    }
                </ol>
            </div>
        </div>
    )
}

export default Todo