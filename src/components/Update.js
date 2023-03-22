import { useEffect, useState } from "react";
import { usePut, useSingleFetch } from "./useFetch";
import Input from './Input.js';
import { useForm } from "react-hook-form";

export default function Update(props) {
    const id = props.id;
    const [status, data] = useSingleFetch("partners", id);
    const { reset, defaultValues, setValue, register, control, handleSubmit } = useForm();

    useEffect(() => {
        // handle successful/failed fetch status and data/error
        if (status == "gotten") {

            setValue('name', data.data.attributes["name"]);
            setValue('mail', data.data.attributes["mail"]);
            setValue('phone', data.data.attributes["phone"]);
            setValue('subject', data.data.attributes["subject"]);
            setValue('message', data.data.attributes["message"]);
        }
    }, [data]);

    const [setFetch, fetchStatus, responseData] = usePut("partners", id, {});

    const onSubmit = (data, e) => {
        console.log(data, e);
        setFetch(data);
        props.handleClick();
    };
    const [myError, setMyError] = useState();

    const onError = (errors, e) => {
        console.log(errors, e);
        setMyError(errors);
    }

    if (data.length !== 0) {
        return (
            <>
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
                                message: "Please make sure you're using a valid email."
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
                            minLength:10,
                            maxLength:12
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
            </>
        )
    } else {
        return <>{id}</>
    }
}