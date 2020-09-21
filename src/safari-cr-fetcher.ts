import { getAllScores } from './api';

getAllScores().then(result => chrome.runtime.sendMessage(result))
