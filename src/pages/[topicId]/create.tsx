import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { forwardRef, InputHTMLAttributes, PropsWithChildren, Ref, useState } from 'react';
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { Container } from '../../components/containers/Container';
import { useTopicId } from '../../components/topics/useTopicId';
import { trpc } from '../../utils/trpc';
import { CreatePostInputSchema, POLL_OPTIONS_MAX } from '../../validation/post';
import { ErrorMessage } from '@hookform/error-message';

export default function Create() {
  // Required: We want to ensure user has signed in so they don't waste time filling out a form
  // that requires authentication to fill out!
  useSession({ required: true });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreatePostInputSchema>({
    defaultValues: {
      options: [{ text: '' }, { text: '' }],
    },
  });
  const createPost = trpc.post.create.useMutation();
  const [isSending, setIsSending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const topicId = useTopicId();
  const router = useRouter();

  const onSubmit = async (data: CreatePostInputSchema) => {
    setShowErrors(false);
    setIsSending(true);
    try {
      const result = await createPost.mutateAsync({ ...data, topicId, type: 'MULTIPLE_CHOICE' });
      await router.replace(`/${topicId}/${result.id}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4 text-center text-2xl font-semibold">Create a Poll</h1>
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          setShowErrors(true);
        })}
        className="grid gap-2"
      >
        <div>
          <Input
            type="text"
            placeholder='Title (e.g. "What should the next Foony game be?")'
            {...register('title', { required: 'You must include a title.' })}
          />
          <ErrorMessage
            errors={showErrors ? errors : {}}
            name="title"
            render={({ message }) => <p className="text-red-400">{message}</p>}
          />
        </div>
        <Toggleable>
          <Input
            type="text"
            placeholder='Description (e.g. "I want to know kthx")'
            {...register('description')}
          />
        </Toggleable>

        <PostOptions control={control} errors={errors} register={register} watch={watch} />

        <p className="text-center text-neutral-400">All polls have a duration of 1 week.</p>

        <Input type="hidden" value="MULTIPLE_CHOICE" {...register('type')} />
        <Input type="hidden" value={topicId} {...register('topicId')} />
        <div>
          <input
            type="submit"
            disabled={isSending}
            className="relative w-full cursor-pointer rounded-md border border-transparent bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-gray-600"
            value="Create Poll"
          />
          <ErrorMessage
            errors={showErrors ? errors : {}}
            name="options"
            render={({ message }) => <p className="text-red-400">{message}</p>}
          />
        </div>
      </form>
    </Container>
  );
}

function PostOptions(props: {
  control: Control<CreatePostInputSchema>;
  errors: FieldErrors<CreatePostInputSchema>;
  register: UseFormRegister<CreatePostInputSchema>;
  watch: UseFormWatch<CreatePostInputSchema>;
}) {
  const { control, errors, register, watch } = props;
  const { fields, append, remove } = useFieldArray({ control, name: 'options' });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => {
        return (
          <PostOption
            key={field.id}
            disableRemove={fields.length <= 2}
            errors={errors}
            register={register}
            index={index}
            remove={remove}
            value={field.text}
            watch={watch}
          />
        );
      })}
      {fields.length < POLL_OPTIONS_MAX && (
        <button
          onClick={(e) => {
            e.preventDefault();
            append({ text: '' });
          }}
          className="flex max-w-fit gap-2 self-start text-neutral-400 hover:text-neutral-200"
        >
          <PlusIcon className="block h-7 w-7" />
          Add option
        </button>
      )}
    </div>
  );
}

function PostOption(props: {
  disableRemove?: boolean;
  errors: FieldErrors<CreatePostInputSchema>;
  register: UseFormRegister<CreatePostInputSchema>;
  index: number;
  remove: UseFieldArrayRemove;
  value: string;
  watch: UseFormWatch<CreatePostInputSchema>;
}) {
  const { disableRemove, errors, register, index, remove, watch, value } = props;

  const watchOptions = watch('options');
  const needsOptions = watchOptions.filter((option) => option.text.length > 0).length < 2;
  return (
    <div>
      <div className="relative flex">
        <Input
          key={`option-${index}`}
          className="pr-[20px]"
          placeholder={`Option ${index + 1}`}
          type="text"
          defaultValue={value}
          {...register(`options.${index}.text`, {
            required: needsOptions && 'You need at least 2 options.',
          })}
        />
        {!disableRemove && (
          <button onClick={() => remove(index)} className="absolute right-2 top-0 bottom-0">
            <XMarkIcon
              className="block h-7 w-7 text-neutral-400 hover:text-red-500"
              fill="currentColor"
            />
          </button>
        )}
      </div>
      <ErrorMessage
        errors={needsOptions ? errors : {}}
        name={`options.${index}.text`}
        render={({ message }) => <p className="text-red-400">{message}</p>}
      />
    </div>
  );
}

function Toggleable(props: PropsWithChildren<{}>) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible((prevState) => !prevState)}
        className="flex max-w-fit gap-2 text-neutral-400 hover:text-neutral-200"
      >
        <PlusIcon className="block h-7 w-7" />
        Add description
      </button>
    );
  }

  return (
    <div className="flex flex-col">
      {props.children}
      <button
        className="max-w-fit self-end text-neutral-400 hover:text-neutral-200"
        onClick={() => setIsVisible((prevState) => !prevState)}
      >
        Hide
      </button>
    </div>
  );
}

const Input = forwardRef(function Input(
  props: InputHTMLAttributes<HTMLInputElement>,
  ref: Ref<HTMLInputElement>
) {
  const { className } = props;
  return (
    <input
      {...props}
      ref={ref}
      className={clsx(
        'form-input block w-full rounded-lg border border-neutral-600 bg-neutral-700 p-2.5 text-sm text-white placeholder-neutral-400 hover:border-neutral-500 hover:bg-neutral-600 focus:border-blue-500 focus:ring-blue-500',
        className
      )}
    />
  );
});
