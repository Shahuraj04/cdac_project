import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, ListTodo } from 'lucide-react';

export default function TodoList({ userKey = 'default' }) {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem(`todos_${userKey}`);
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        localStorage.setItem(`todos_${userKey}`, JSON.stringify(todos));
    }, [todos, userKey]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
            createdAt: new Date().toISOString()
        };
        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/30 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-2xl text-slate-800 flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <ListTodo size={20} />
                    </div>
                    <span>Daily Objectives</span>
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                    {todos.filter(t => !t.completed).length} Pending
                </span>
            </div>

            <form onSubmit={addTodo} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus size={20} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-[400px]">
                {todos.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-300 font-bold uppercase tracking-widest italic text-xs">No tasks for today</p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div
                            key={todo.id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${todo.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-indigo-200'
                                }`}
                        >
                            <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                                <button className={`${todo.completed ? 'text-emerald-500' : 'text-slate-300'}`}>
                                    {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                </button>
                                <span className={`font-bold text-sm ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                    {todo.text}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
