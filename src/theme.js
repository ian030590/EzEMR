try { const theme = localStorage.getItem('ezrehab-theme'); if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme; } catch (_) {}
