import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const { user } = useAuth();

  const [savedArticles, setSavedArticles] = useState({});

  const getUserSavedArticles = () => {
    if (!user) return [];
    return savedArticles[user.username] || [];
  };

  const getAllUserArticles = () => {
  return savedArticles;
};

  const saveArticle = (article) => {
    if (!user) return;

    setSavedArticles(prev => {
      const userArticles = prev[user.username] || [];

      // Check if article is already saved
      if (userArticles.find(a => a.url === article.url)) {
        return prev;
      }

      return {
        ...prev,
        [user.username]: [...userArticles, article]
      };
    });
  };

  const removeArticle = (url) => {
    if (!user) return;

    setSavedArticles(prev => ({
      ...prev,
      [user.username]: (prev[user.username] || []).filter(a => a.url !== url)
    }));
  };

  const isArticleSaved = (url) => {
    return getUserSavedArticles().some(a => a.url === url);
  };

  return (
    <ArticlesContext.Provider
      value={{
        savedArticles,
        saveArticle,
        removeArticle,
        isArticleSaved,
        getUserSavedArticles,
        getAllUserArticles
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};