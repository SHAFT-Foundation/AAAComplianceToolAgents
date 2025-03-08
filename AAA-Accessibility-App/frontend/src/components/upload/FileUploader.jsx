import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Audiotrack as AudioIcon,
  Videocam as VideoIcon,
} from '@mui/icons-material';

const FileUploader = ({
  acceptedFileTypes,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  isLoading = false,
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      console.log('[FileUploader] Files dropped:', acceptedFiles);
      
      // Handle rejected files
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejectionReasons = rejectedFiles.map(rejection => {
          const { file, errors } = rejection;
          return `${file.name}: ${errors.map(e => e.message).join(', ')}`;
        });
        setError(`Some files were rejected: ${rejectionReasons.join('; ')}`);
        return;
      }

      // Clear previous errors
      setError(null);

      // Update files state
      setFiles(prevFiles => {
        const newFiles = [...prevFiles, ...acceptedFiles];
        // Limit to maxFiles
        return newFiles.slice(0, maxFiles);
      });

      // Call the onUpload callback
      onUpload(acceptedFiles);
    },
    [maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes ? { [acceptedFileTypes]: [] } : undefined,
    maxFiles,
    maxSize,
    multiple: maxFiles > 1,
  });

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <ImageIcon />;
    if (file.type.startsWith('audio/')) return <AudioIcon />;
    if (file.type.startsWith('video/')) return <VideoIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          backgroundColor: isDragActive ? 'rgba(0, 86, 179, 0.04)' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 86, 179, 0.04)',
          },
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 3,
          }}
        >
          <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {maxFiles > 1
              ? `Up to ${maxFiles} files, max ${formatFileSize(maxSize)} each`
              : `Max file size: ${formatFileSize(maxSize)}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Accepted file types: {acceptedFileTypes || 'All files'}
          </Typography>
        </Box>
      </Paper>

      {files.length > 0 && (
        <List>
          {files.map((file, index) => (
            <ListItem
              key={`${file.name}-${index}`}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={() => removeFile(index)}
                  disabled={isLoading}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>{getFileIcon(file)}</ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${formatFileSize(file.size)} - ${file.type || 'Unknown type'}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
          disabled={files.length === 0 || isLoading}
          onClick={() => onUpload(files)}
        >
          {isLoading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUploader; 