import { SyntheticEvent, useRef, useState } from "react"

const App = () => {
  const [image, setImage] = useState<File | null>()
  const [imageURL, setImageURL] = useState<string>("")
  
  const canvRef: any = useRef()
  
  const handleImageSelection = (e: SyntheticEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files

    if (files && files.length > 0) {
      setImage(files[0])
      setImageURL(URL.createObjectURL(files[0]))
    }
  }

  const convertImageToGrayscale = () => {
    // Create a canvas and get its context
    const canvas: HTMLCanvasElement | null = canvRef.current;
    const ctx = canvas?.getContext("2d")

    // Define image
    const currentImage: HTMLImageElement | null = new Image()
    currentImage.src = imageURL;

    // Wait for image to load
    currentImage!.onload = () => {
      // Set canvas's width and height
      canvas!.width = currentImage.width;
      canvas!.height = currentImage.height;
      
      // Draw the image
      ctx?.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height)
      
      // Get the image data
      const imageData: ImageData | undefined = ctx?.getImageData(0, 0, currentImage.width, currentImage.height)
      const data = imageData?.data
      
      // Loop through every pixel in the image data
      for (let i = 0; i < data!.length; i++) { 
        // Get rgb and gray values
        const red = data![i]
        const green = data![i + 1]
        const blue = data![i + 2]
        const gray = (red + green + blue) / 3
        
        // Apply it
        data![i] = gray
        data![i + 1] = gray
        data![i + 2] = gray
      }
      
      // Apply grayscaled effect
      ctx?.putImageData(imageData!, 0, 0)
    }
  }
  
  const detectImage = (e: SyntheticEvent<HTMLButtonElement>) => {
    convertImageToGrayscale()
  }
  
  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <h1 className="font-bold text-3xl">Digit classifier</h1>
      
      <div className="mt-10 flex flex-col items-center">
        {image && (
          <div className="flex flex-col w-max">
            <img src={URL.createObjectURL(image)} alt="Image" className="border h-[10rem] w-[10rem]" />
            <canvas ref={canvRef} className="border h-[10rem] w-[10rem] hidden" />

            <div className="mt-5 flex flex-col gap-y-2">
              <button onClick={() => setImage(null)} className="rounded-full py-2 px-3 bg-gray-500 mt-2">Remove</button>
              <button onClick={detectImage} className="rounded-full py-2 px-3 bg-blue-500">Detect digit</button>
            </div>
          </div>
        )}

        <input type="file" onChange={handleImageSelection} className="mt-10" />
      </div>
    </div>
  )
}

export default App