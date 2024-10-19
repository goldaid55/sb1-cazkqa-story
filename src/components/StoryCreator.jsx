import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FaImage, FaVideo, FaFont, FaPalette, FaDownload, FaAlignLeft, FaAlignCenter, FaAlignRight, FaMusic, FaMagic, FaVolumeUp } from 'react-icons/fa';

const genAI = new GoogleGenerativeAI('AIzaSyDElJVLIRIGWUEVkOvpZ6jKsLqv-IdUU64');

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function StoryCreator({ addStory }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState('#ffffff');
  const [gradientColor1, setGradientColor1] = useState('#ff00ff');
  const [gradientColor2, setGradientColor2] = useState('#00ffff');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [theme, setTheme] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [textPosition, setTextPosition] = useState('center');
  const [music, setMusic] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('landscape');
  const [isLoading, setIsLoading] = useState(false);

  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const textOverlayRef = useRef(null);

  const aspectRatios = {
    square: { width: 1080, height: 1080 },
    portrait: { width: 1080, height: 1350 },
    landscape: { width: 1080, height: 608 },
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia(e.target.result);
        setMediaType(file.type.startsWith('image') ? 'image' : 'video');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*,video/*' });

  const generateStory = async () => {
    if (!theme) {
      alert('Пожалуйста, введите тему для генерации истории.');
      return;
    }
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `Создай короткую историю на тему "${theme}" длиной не более 280 символов. История должна быть интересной и захватывающей.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setContent(text);
      setTitle(`История о ${theme}`);
    } catch (error) {
      console.error('Ошибка при генерации истории:', error);
      alert('Произошла ошибка при генерации истории. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt) {
      alert('Пожалуйста, введите промпт для генерации изображения.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(imagePrompt)}&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.urls.regular;
        setMedia(imageUrl);
        setMediaType('image');
      } else {
        throw new Error('Не удалось загрузить изображение');
      }
    } catch (error) {
      console.error('Ошибка при генерации изображения:', error);
      alert('Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAudio = async () => {
    if (!content) {
      alert('Пожалуйста, сначала сгенерируйте или введите текст истории.');
      return;
    }
    setIsLoading(true);
    try {
      // Здесь должен быть ваш код для генерации аудио с использованием ElevenLabs API
      // Пока что мы просто симулируем генерацию аудио
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMusic('https://example.com/generated-audio.mp3');
      alert('Аудио успешно сгенерировано! (симуляция)');
    } catch (error) {
      console.error('Ошибка при генерации аудио:', error);
      alert('Произошла ошибка при генерации аудио. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content && media) {
      addStory({ title, content, font, fontSize, textColor, gradientColor1, gradientColor2, media, mediaType, textPosition, music, aspectRatio });
      // Очистка формы после отправки
      setTitle('');
      setContent('');
      setFont('Arial');
      setFontSize(20);
      setTextColor('#ffffff');
      setGradientColor1('#ff00ff');
      setGradientColor2('#00ffff');
      setMedia(null);
      setMediaType('image');
      setTheme('');
      setImagePrompt('');
      setTextPosition('center');
      setMusic(null);
      setAspectRatio('landscape');
    } else {
      alert('Пожалуйста, заполните все обязательные поля.');
    }
  };

  const downloadImage = async () => {
    if (mediaRef.current) {
      const dataUrl = await toPng(mediaRef.current);
      saveAs(dataUrl, 'story-image.png');
    }
  };

  const downloadVideo = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const drawText = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize * (canvas.width / aspectRatios[aspectRatio].width)}px ${font}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = textPosition;
        ctx.textBaseline = 'middle';

        const x = textPosition === 'left' ? 20 : textPosition === 'right' ? canvas.width - 20 : canvas.width / 2;
        const y = canvas.height / 2;

        const words = content.split(' ');
        let line = '';
        let lineY = y - (fontSize * words.length) / 2;

        words.forEach(word => {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > canvas.width * 0.8 && line !== '') {
            ctx.fillText(line, x, lineY);
            line = word + ' ';
            lineY += fontSize;
          } else {
            line = testLine;
          }
        });
        ctx.fillText(line, x, lineY);
      };

      video.addEventListener('play', function() {
        function step() {
          drawText();
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });

      const stream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'story-video.webm';
        a.click();
      };

      video.currentTime = 0;
      video.play();
      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        video.pause();
      }, video.duration * 1000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl mb-6 font-bold text-center text-purple-800">Создать новую историю</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
            Тема истории
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            id="theme"
            type="text"
            placeholder="Введите тему для генерации истории"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        <div>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full flex items-center justify-center"
            onClick={generateStory}
            disabled={isLoading}
          >
            <FaMagic className="mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать историю'}
          </button>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Заголовок
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            id="title"
            type="text"
            placeholder="Введите заголовок истории"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Содержание
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 bg-white"
            id="content"
            placeholder="Введите содержание истории"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagePrompt">
            Промпт для изображения
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            id="imagePrompt"
            type="text"
            placeholder="Введите промпт для генерации изображения"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          />
        </div>
        <div>
          <button
            type="button"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full flex items-center justify-center"
            onClick={generateImage}
            disabled={isLoading}
          >
            <FaImage className="mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать изображение'}
          </button>
        </div>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition duration-300 ease-in-out">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Перетащите файл сюда...</p>
          ) : (
            <p>Перетащите изображение или видео сюда, или кликните для выбора файла</p>
          )}
        </div>
        {media && (
          <div className="mt-4 relative" ref={mediaRef} style={{
            width: '100%',
            paddingTop: `${(aspectRatios[aspectRatio].height / aspectRatios[aspectRatio].width) * 100}%`,
            overflow: 'hidden'
          }}>
            {mediaType === 'image' ? (
              <img src={media} alt="Uploaded media" className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg" />
            ) : (
              <video ref={videoRef} src={media} className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg" controls />
            )}
            <div
              ref={textOverlayRef}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4"
              style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                color: textColor,
                textAlign: textPosition,
                textShadow: `2px 2px 4px ${gradientColor1}, -2px -2px 4px ${gradientColor2}`,
              }}
            >
              <p className="text-center break-words" style={{maxWidth: '90%'}}>{content}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="font">
              Шрифт
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="font"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier">Courier</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fontSize">
              Размер шрифта
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="fontSize"
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textColor">
              Цвет текста
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="textColor"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textPosition">
              Позиция текста
            </label>
            <div className="flex justify-between">
              <button
                type="button"
                className={`px-4 py-2 rounded ${textPosition === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTextPosition('left')}
              >
                <FaAlignLeft />
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${textPosition === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTextPosition('center')}
              >
                <FaAlignCenter />
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${textPosition === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setTextPosition('right')}
              >
                <FaAlignRight />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gradientColor1">
              Цвет градиента 1
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="gradientColor1"
              type="color"
              value={gradientColor1}
              onChange={(e) => setGradientColor1(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gradientColor2">
              Цвет градиента 2
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
              id="gradientColor2"
              type="color"
              value={gradientColor2}
              onChange={(e) => setGradientColor2(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aspectRatio">
            Соотношение сторон
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="square">Квадрат (1:1)</option>
            <option value="portrait">Портрет (4:5)</option>
            <option value="landscape">Ландшафт (16:9)</option>
          </select>
        </div>
        <div>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full flex items-center justify-center"
            onClick={generateAudio}
            disabled={isLoading}
          >
            <FaVolumeUp className="mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать аудио'}
          </button>
        </div>
        {media && (
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              onClick={mediaType === 'image' ? downloadImage : downloadVideo}
            >
              <FaDownload className="mr-2 inline" />
              Скачать {mediaType === 'image' ? 'изображение' : 'видео'}
            </button>
          </div>
        )}
        <div className="flex items-center justify-center">
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Создать историю
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoryCreator;