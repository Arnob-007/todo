import { useState } from "react";
import "./App.css";
import moonIcon from "./Assets/icon-moon.svg";
import sunIcon from "./Assets/icon-sun.svg";
import checkIcon from "./Assets/icon-check.svg";
import crossIcon from "./Assets/icon-cross.svg";

const App = () => {
	const [allTodos, setAllTodos] = useState([]);
	const [todoState, setTodoState] = useState("All");
	const [inp, setInp] = useState("");
	const [isNew, setIsNew] = useState(false);
	const [count, setCount] = useState(0);
	const [isDark, setIsDark] = useState(false);
	const [dragover, setDragover] = useState(null);

	const addToDo = (e) => {
		e.preventDefault();

		if (isNew) {
			setAllTodos((prevState) => [
				...prevState,
				{ title: inp, completed: false },
			]);
			setCount(count + 1);
		}
		setInp("");
		setIsNew(false);
	};

	const clearTodo = () => {
		const newArray = allTodos.filter((todo) => todo.completed === false);
		setAllTodos([...newArray]);
	};

	const changeTheme = () => {
		const elm = document.getElementById("app");
		setIsDark(!isDark);
		elm.classList.toggle("dark");
	};

	const handleInput = (e) => {
		const val = e.target.value;
		setInp(val);

		if (val)
			if (allTodos.length)
				for (let i = 0; i < allTodos.length; i++) {
					if (allTodos[i].title.toLowerCase() === val.toLowerCase()) {
						setIsNew(false);
						break;
					} else setIsNew(true);
				}
			else setIsNew(true);
		else setIsNew(false);
	};

	return (
		<div id='app' className='app light'>
			<div className='header__container'>
				<div className='header'>
					<div className='title__container'>
						<h1>T O D O</h1>
						<img
							onClick={changeTheme}
							src={isDark ? sunIcon : moonIcon}
							alt='icon'
						></img>
					</div>
					<form onSubmit={addToDo} className='input'>
						<div className={`check ${isNew && "checked"}`}>
							{isNew && <img src={checkIcon} alt='check'></img>}
						</div>
						<input
							onChange={handleInput}
							value={inp}
							placeholder='Create a new todo..'
						/>
					</form>
				</div>
			</div>
			<div className='todos__container'>
				<div className='todos'>
					<div className='todos__list'>
						{todoState === "All"
							? allTodos.map((todo, index) => (
									<Todo
										key={index}
										index={index}
										title={todo.title}
										completed={todo.completed}
										allTodos={allTodos}
										setAllTodos={setAllTodos}
										setCount={setCount}
										dragover={dragover}
										setDragover={setDragover}
									/>
							  ))
							: todoState === "Active"
							? allTodos.map(
									(todo, index) =>
										!todo.completed && (
											<Todo
												key={index}
												index={index}
												title={todo.title}
												completed={todo.completed}
												allTodos={allTodos}
												setAllTodos={setAllTodos}
												setCount={setCount}
												dragover={dragover}
												setDragover={setDragover}
											/>
										)
							  )
							: allTodos.map(
									(todo, index) =>
										todo.completed && (
											<Todo
												key={index}
												index={index}
												title={todo.title}
												completed={todo.completed}
												allTodos={allTodos}
												setAllTodos={setAllTodos}
												setCount={setCount}
												dragover={dragover}
												setDragover={setDragover}
											/>
										)
							  )}
					</div>
					<div className='todos__footer'>
						<div className='info'>{count} items left</div>
						<div className='state1'>
							<Stats todoState={todoState} setTodoState={setTodoState} />
						</div>
						<div onClick={clearTodo} className='info info__state'>
							Clear Completed
						</div>
					</div>
				</div>
				<div className='state2'>
					<Stats todoState={todoState} setTodoState={setTodoState} />
				</div>
			</div>
			<div className='footer'>Drag and drop to reorder list</div>
		</div>
	);
};

const Todo = ({
	title,
	index,
	completed,
	allTodos,
	setAllTodos,
	setCount,
	dragover,
	setDragover,
}) => {
	const handleComplete = () => {
		if (!completed) {
			let newArray = allTodos;
			newArray[index].completed = true;
			setAllTodos([...newArray]);
			setCount((prevState) => prevState - 1);
		}
	};

	const handleRemove = () => {
		let newArray = allTodos;
		newArray.splice(index, 1);
		setAllTodos([...newArray]);
		!completed && setCount((prevState) => prevState - 1);
	};

	const handleDragStart = () =>
		(document.getElementById(index).style.opacity = 0.2);

	const handleDragEnd = () => {
		document.getElementById(index).style.opacity = 1;

		let newArray = allTodos;
		let temp = newArray[index];
		newArray[index] = newArray[dragover];
		newArray[dragover] = temp;

		setAllTodos(newArray);
		setDragover(null);
	};

	return (
		<div
			id={index}
			className='todo__item input'
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={(e) => {
				e.preventDefault();
				setDragover(index);
			}}
		>
			<div
				onClick={handleComplete}
				className={`check ${completed && "checked"}`}
			>
				{completed && <img src={checkIcon} alt='check'></img>}
			</div>
			<div className={`todo__task ${completed && "complete"}`}>{title}</div>
			<div onClick={handleRemove}>
				<img className='crossIcon' src={crossIcon} alt='remove'></img>
			</div>
		</div>
	);
};

const Stats = ({ todoState, setTodoState }) => {
	return (
		<div className='info info__mobile'>
			<span
				onClick={() => setTodoState("All")}
				className={`info__state ${todoState === "All" && "activeState"}`}
			>
				All
			</span>
			<span
				onClick={() => setTodoState("Active")}
				className={`info__state ${todoState === "Active" && "activeState"}`}
			>
				Active
			</span>
			<span
				onClick={() => setTodoState("Complete")}
				className={`info__state ${todoState === "Complete" && "activeState"}`}
			>
				Completed
			</span>
		</div>
	);
};

export default App;
