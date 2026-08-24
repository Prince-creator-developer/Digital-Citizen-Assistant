'use client';
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

export default function VoiceRecorder({ onRecordingComplete, isProcessing }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('माइक्रोफोन अनुमति की आवश्यकता है (Microphone permission needed)');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop stream tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {isRecording ? (
        <button
          onClick={stopRecording}
          className="w-20 h-20 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-2xl animate-pulse transition-transform scale-110"
        >
          <Square className="w-8 h-8 fill-current" />
        </button>
      ) : isProcessing ? (
        <div className="w-20 h-20 bg-saffron-500 text-white rounded-full flex items-center justify-center shadow-2xl">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="w-20 h-20 bg-gradient-to-tr from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
        >
          <Mic className="w-9 h-9" />
        </button>
      )}

      <p className="text-xs font-bold tracking-wide text-slate-600">
        {isRecording
          ? 'रिकॉर्डिंग जारी है... रोकने के लिए लाल बटन दबाएं'
          : isProcessing
          ? 'आवाज़ का विश्लेषण हो रहा है...'
          : 'बोलने के लिए माइक दबाएं (Tap to Speak)'}
      </p>
    </div>
  );
}
