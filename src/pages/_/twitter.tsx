/** OnlyPain_Ctrl: wtf twitter AAAA; u r pain */
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../components/buttons/Button';
import { Container } from '../../components/containers/Container';
import NextImage, { ImageProps } from 'next/image';

/** Resizes / clips an image for Twitter. */
export default function TwitterClipper() {
  return (
    <Container className="flex flex-col gap-2">
      <h1 className="text-center text-2xl font-semibold">Twitter Image Center-er</h1>
      <p className="text-center text-neutral-400">
        Upload an image. It'll be resized to a 2:1 aspect ratio to look great in Twitter posts.
      </p>
      <ResizeArea />
    </Container>
  );
}

function ResizeArea() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [src, setSrc] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // True if dragging over the input

  const handleUpload = useCallback(async () => {
    const input = fileRef.current;
    if (!input) {
      return;
    }
    for (const file of input.files || []) {
      if (!isValidFileType(file)) {
        continue;
      }
      const image = await cropImage(file);
      setSrc(image.src);
      setWidth(image.width);
      setHeight(image.height);
      return;
    }
  }, [setSrc, setWidth, setHeight]);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      const file = e.clipboardData?.files?.[0];
      if (!file) {
        return;
      }
      const image = await cropImage(file);
      setSrc(image.src);
      setWidth(image.width);
      setHeight(image.height);
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const imageProps: Pick<ImageProps, 'src' | 'onClick' | 'onDrop' | 'className'> = {
    src: src,
    className: clsx(
      'flex items-center justify-center text-lg font-semibold text-neutral-100 select-none h-full w-full',
      !src && 'bg-neutral-700 group-hover:bg-neutral-600'
    ),
  };
  return (
    <>
      <Button
        onClick={() => console.log('FIXME(acorn1010): Implement copying.')}
        className="flex self-end whitespace-nowrap"
      >
        Copy <DocumentDuplicateIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
      <div
        className={clsx(
          'group relative aspect-2/1 cursor-pointer overflow-hidden rounded-md border bg-black hover:bg-trueGray-900 hover:brightness-110',
          isDragging && 'bg-trueGray-900 brightness-110'
        )}
      >
        {src ? (
          <NextImage alt="dropzone" width={width} height={height} {...imageProps} />
        ) : (
          <p {...imageProps} className={clsx(imageProps.className, isDragging && 'bg-neutral-600')}>
            Drop an image here!
          </p>
        )}
        <input
          accept={VALID_FILE_TYPES.join(',')}
          type="file"
          onChange={handleUpload}
          onDrop={() => setIsDragging(false)}
          onDragEnter={() => setIsDragging(true)}
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          ref={fileRef}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </>
  );
}

const VALID_FILE_TYPES = ['image/avif', 'image/bmp', 'image/jpeg', 'image/png', 'image/webp'];

function isValidFileType(file: File) {
  const extension = file.name.slice(file.name.lastIndexOf('.'));
  return VALID_FILE_TYPES.includes(file.type || extension);
}

/** Returns a cropped version of `blob` in a 2:1 aspect ratio for use on Twitter. */
async function cropImage(blob: Blob) {
  return new Promise<{ src: string; width: number; height: number }>(async (resolve, reject) => {
    try {
      const image = new Image();
      image.onload = () => {
        // TODO(acorn1010): Do the image cropping here.
        resolve(image);
      };
      image.src = await readImageBlob(blob);
    } catch (e) {
      reject(e);
    }
  });
}

async function readImageBlob(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject('Failed to read image.');
        }
      },
      false
    );
    reader.readAsDataURL(blob);
  });
}
