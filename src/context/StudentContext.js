// src/context/StudentContext.js
import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAPS } from '../utils/apsCalculator';
import { getMatchingProgrammes } from '../services/programmeService';

const StudentContext = createContext({});

const STORAGE_KEY = '@career_compass_student_data';

export const StudentProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]); // [{ subject: 'Mathematics', percentage: 70 }, ...]
  const [apsScore, setApsScore] = useState(0);
  const [matchingResults, setMatchingResults] = useState([]);
  const [isMatching, setIsMatching] = useState(false);

  // Set subjects and recalculate APS score
  const updateSubjects = async (newSubjects) => {
    setSubjects(newSubjects);
    const { totalAPS } = calculateAPS(newSubjects);
    setApsScore(totalAPS);

    // Persist locally so student doesn't lose data on app reload
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ subjects: newSubjects, apsScore: totalAPS })
      );
    } catch (e) {
      console.warn('Failed to cache student subjects offline', e);
    }
  };

  // Run the matching engine against Supabase
  const runMatching = async () => {
    if (!subjects || subjects.length === 0) return [];
    setIsMatching(true);
    try {
      const results = await getMatchingProgrammes(subjects);
      setMatchingResults(results);
      return results;
    } catch (error) {
      console.error('Matching engine run failed:', error);
      throw error;
    } finally {
      setIsMatching(false);
    }
  };

  const clearStudentData = async () => {
    setSubjects([]);
    setApsScore(0);
    setMatchingResults([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <StudentContext.Provider
      value={{
        subjects,
        apsScore,
        matchingResults,
        isMatching,
        updateSubjects,
        runMatching,
        clearStudentData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
