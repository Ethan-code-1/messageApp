import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Container, Box, Typography, TextField, Button, Card, Grid } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState('');
  const [editingMessage, setEditingMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [searchTerm, messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/messages');
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5001/messages', {
        author: username,
        content: message,
      });
      setUsername('');
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Error submitting message: ", error);
    }
  };

  const handleEdit = (id, currentMessage, currentAuthor) => {
    setEditingId(id);
    setEditingAuthor(currentAuthor);
    setEditingMessage(currentMessage);
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5001/messages/${id}`, {
        author: editingAuthor,
        content: editingMessage,
      });
      setEditingId(null);
      setEditingAuthor('');
      setEditingMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Error saving message: ", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Error removing message:", error);
    }
  };

  const filterMessages = () => {
    if (searchTerm === '') {
      return messages;
    }
    return messages.filter(message =>
      message.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className = "outerContainer">
    <Container maxWidth="lg">
      <Grid container spacing={8}>
        <Grid 
          item 
          xs={12} 
          md={4} 
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ flexDirection: 'column', minHeight: '80vh' }}
        >
          <Box width="100%">
            <Typography variant="h2" component="h1" gutterBottom textAlign="center">
              Welcome
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom textAlign="center">
              Draft new messages to send to others
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: '100%' }}
            >
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="custom-textfield"
              />
              <TextField
                fullWidth
                label="Message Content"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="custom-textfield"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={8}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
              maxHeight: '80vh',
              overflowY: 'auto',
              borderLeft: '1px solid #ddd',
              padding: 2,
              width: '100%',
            }}
          >
            <TextField
              fullWidth
              label="Search by Author"
              variant="outlined"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Typography variant="h6" component="h2" gutterBottom>
              Messages:
            </Typography>
            {filterMessages().map((message) => (
              <Box key={message.id} sx={{ width: '100%', mb: 2 }}>
                {editingId === message.id ? (
                  <Card
                    id="messageCardEditView"
                    sx={{
                      borderColor: '#1976d2e0',
                      borderWidth: '3px',
                      borderStyle: 'solid',
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Author"
                      variant="outlined"
                      margin="normal"
                      value={editingAuthor}
                      onChange={(e) => setEditingAuthor(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Message Content"
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      value={editingMessage}
                      onChange={(e) => setEditingMessage(e.target.value)}
                    />
                    <div className="btns">
                      <Button
                        variant="outlined"
                        onClick={() => handleSave(message.id)}
                        sx={{
                          color: 'white',
                          borderColor: 'white',
                          backgroundColor: '#4DCD21',
                          marginRight: '2vh',
                          '&:hover': {
                            backgroundColor: '#4DCD21',
                            borderColor: 'white',
                          },
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card id="messageCard" sx={{ p: 2 }}>
                    <Typography variant="body1">
                      <strong>{message.author}</strong>
                    </Typography>
                    <Typography variant="body2">{message.content}</Typography>
                    <div className="btns">
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(message.id, message.content, message.author)}
                        sx={{
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleRemove(message.id)}
                        sx={{
                          color: 'white',
                          backgroundColor: '#D72D26',
                          borderColor: 'white',
                          marginRight: '2vh',
                          marginLeft: '2vh',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: '#D72D26',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default Home;
