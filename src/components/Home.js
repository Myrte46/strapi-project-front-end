import useFetch, { usePost, useDelete } from './useFetch.js';
import { useState, useEffect } from 'react';
import Update from './Update.js';
import { useForm } from "react-hook-form";
import Input from './Input.js';
import "./Home.css";

export default function Home() {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });
    //get section
    const [update, setUpdate] = useState(0);
    const [getStatus, getResponseData] = useFetch("partners", update);

    const [data, setData] = useState((getResponseData || []));

    useEffect(() => {
        // handle successful/failed fetch status and data/error
        console.log("Get log ", getStatus, getResponseData);
        setData(getResponseData);
    }, [getStatus, getResponseData]);

    //post section
    const [setFetch, fetchStatus, responseData] = usePost("partners", {});

    useEffect(() => {
        // handle successful/failed fetch status and data/error
        console.log("Post log ", fetchStatus, responseData);
        setUpdate(update + 1);
    }, [fetchStatus, responseData]);

    const onSubmit = (data, e) => {
        console.log(data, e);
        setFetch(data);
    };

    const [myError, setMyError] = useState();

    const onError = (errors, e) => {
        console.log(errors, e);
        setMyError(errors);
    }

    //delete section
    const [deleteId, setDelete] = useState({});
    const [deleteStatus, replyData] = useDelete("partners", deleteId);

    const handleDelete = (e) => {
        const { name } = e.target;
        setDelete(name);
    }

    useEffect(() => {
        // handle successful/failed fetch status and data/error
        console.log("Delete log", deleteStatus, replyData);
        setUpdate(update + 1);
    }, [deleteStatus, replyData]);

    //update section
    const [id, setId] = useState("");

    const handleUpdate = (e) => {
        const { name } = e.target;
        setId(name);
    }

    function handleReturn() {
        setId("");
        setUpdate(update + 1);
    }

    function updateForm() {
        if (id === "") {
            return (<>
                <form onSubmit={handleSubmit(onSubmit, onError)} control={control}>
                    <h1 className='margin'>Form:</h1>
                    <Input
                        name="name"
                        validationSchema={{ required: "This is required" }}
                        label="Je naam"
                        required
                        errorLog={myError}
                        register={register} />
                    <Input
                        name="mail"
                        validationSchema={{
                            required: "This is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Please make sure you're using a valid email"
                            }
                        }}
                        label="Je e-mailadres"
                        required
                        errorLog={myError}
                        register={register} />
                    <Input
                        name="phone"
                        validationSchema={{
                            required: "This is required",
                            pattern: {
                                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
                                message: "Please make sure you are using a valid phone number"
                            }
                        }}
                        label="Je telefoon"
                        required
                        errorLog={myError}
                        register={register}
                    />
                    <Input
                        name="subject"
                        validationSchema={{ required: "This is required" }}
                        label="Onderwerp"
                        required
                        errorLog={myError}
                        register={register} />
                    <Input
                        name="message"
                        validationSchema={{ required: "This is required" }}
                        label="Je bericht"
                        required
                        errorLog={myError}
                        register={register}
                        textarea/>
                    <button type="submit" className="button margin">Submit</button>
                </form>
                <h2 className='margin'>Information:</h2>
                {
                    (data.data || []).map((item, index) =>
                        <div key={index} className="margin">
                            <h3>{item.attributes.name}</h3>
                            <div>{item.attributes.mail}</div>
                            <div>{item.attributes.phone}</div>
                            <div>{item.attributes.subject}</div>
                            <div dangerouslySetInnerHTML={{ __html: item.attributes.message }} />
                            <button onClick={handleDelete} name={item.id} className="button">Delete</button>
                            <button onClick={handleUpdate} name={item.id} className="button margin">Update</button>
                        </div>
                    )
                }
            </>)
        } else {
            return <Update id={id} handleClick={handleReturn} />
        }
    }

    return (
        <>
            {updateForm()}
        </>
    )
}