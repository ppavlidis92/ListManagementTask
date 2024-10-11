'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'react-signature-canvas';

// Import image
import bodyImage from './body-diagram.png';

// Types for form data
interface FormData {
  name: string;
  email: string;
  dob: string;
  profession: string;
  problemDescription: string;
  painLevel: number;
  acceptTerms: boolean;
  similarPain: boolean;
  sleepAffectsPain: string;
  similarPastPain: string;
  xrayMRI: string;
  visitOtherDoctor: string;
  allowedExercise: string;
  metallicImplants: string;
  cancerHistory: string;
  pregnant: string;
  arthritis: string;
  osteoporosis: string;
  adequateSleep: string;
}

// Types for the SignaturePad refs
type SignaturePadRef = React.MutableRefObject<SignaturePad | null>;

const MarkableImage: React.FC<{ onMarkerAdded: () => void }> = ({
  onMarkerAdded,
}) => {
  const [marker, setMarker] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMarker({ x, y });
      onMarkerAdded();
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      ref={imageRef}
    >
      <div onClick={handleImageClick}>
        <Image src={bodyImage} alt="Body Diagram" width={450} height={400} />
      </div>

      {marker.x !== null && marker.y !== null && (
        <div
          style={{
            position: 'absolute',
            top: marker.y,
            left: marker.x,
            width: '10px',
            height: '10px',
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};

const FormWithExport: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    dob: '',
    profession: '',
    problemDescription: '',
    painLevel: 0,
    acceptTerms: false,
    similarPain: false,
    sleepAffectsPain: '',
    similarPastPain: '',
    xrayMRI: '',
    visitOtherDoctor: '',
    allowedExercise: '',
    metallicImplants: '',
    cancerHistory: '',
    pregnant: '',
    arthritis: '',
    osteoporosis: '',
    adequateSleep: '',
  });

  const formRef = useRef<HTMLDivElement>(null);
  const patientSignatureRef = useRef<SignaturePad | null>(null);
  const physioSignatureRef = useRef<SignaturePad | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      const checked = e.target.checked;
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Function to export the form as PDF using html2canvas and jsPDF
  const handleExportPDF = () => {
    const input = formRef.current;

    // Hide only the clear buttons before export
    const clearButtons =
      document.querySelectorAll<HTMLButtonElement>('.clear-button');
    clearButtons.forEach((button) => (button.style.display = 'none'));

    // Capture the entire form (including signature pads and marked body diagram) in the PDF
    if (input) {
      html2canvas(input, {
        scale: 3, // Increase this value for better quality
        useCORS: true, // Ensures cross-origin images are captured
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 size width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add form image to PDF (this will capture the signatures and the body diagram with marker)
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('form_with_signature.pdf');

        // Restore clear buttons after export
        clearButtons.forEach((button) => (button.style.display = 'block'));
      });
    }
  };

  // Clear signatures
  const clearSignature = (ref: SignaturePadRef) => {
    ref.current?.clear();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <div ref={formRef}>
          <Typography variant="h5" gutterBottom>
            <b>Kineses Physiotherapy Form</b>
          </Typography>

          <Grid container spacing={2}>
            {/* Name, Email, etc. */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            {/* Problem Description */}
            <Grid item xs={12}>
              <Typography variant="h6">
                ΤΙ ΠΡΟΒΛΗΜΑ ΑΝΤΙΜΕΤΩΠΙΖΕΤΕ ΠΟΣΟ ΚΑΙΡΟ & ΠΟΥ:
              </Typography>
              <TextField
                fullWidth
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>

            {/* Markable Image */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                ΣΗΜΑΔΕΨΤΕ ΤΟ ΣΗΜΕΙΟ ΤΟΥ ΠΟΝΟΥ
              </Typography>
              <MarkableImage onMarkerAdded={() => {}} />
            </Grid>
          </Grid>

          {/* Pain Level */}
          <Grid item xs={12}>
            <Typography gutterBottom>Pain Level (0-10):</Typography>
            <RadioGroup
              name="painLevel"
              value={formData.painLevel}
              onChange={handleChange}
              row
            >
              {Array.from({ length: 11 }, (_, i) => i).map((level) => (
                <FormControlLabel
                  key={level}
                  value={level}
                  control={<Radio />}
                  label={level.toString()}
                />
              ))}
            </RadioGroup>
          </Grid>

          {/* Signature Areas */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">ΥΠΟΓΡΑΦΗ ΑΣΘΕΝΟΥΣ:</Typography>
              <div
                className="signature-pad"
                style={{
                  border: '1px solid black',
                  width: '300px',
                  height: '100px',
                }}
              >
                <SignaturePad
                  ref={patientSignatureRef}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: 'sigCanvas',
                  }}
                />
              </div>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
                className="clear-button"
                onClick={() => clearSignature(patientSignatureRef)}
              >
                Clear
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">ΥΠΟΓΡΑΦΗ Φ/Θ:</Typography>
              <div
                className="signature-pad"
                style={{
                  border: '1px solid black',
                  width: '300px',
                  height: '100px',
                }}
              >
                <SignaturePad
                  ref={physioSignatureRef}
                  canvasProps={{
                    width: 300,
                    height: 100,
                    className: 'sigCanvas',
                  }}
                />
              </div>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
                className="clear-button"
                onClick={() => clearSignature(physioSignatureRef)}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  name="acceptTerms"
                />
              }
              label="Accept Terms and Conditions"
            />
          </Grid>
        </div>

        {/* Export Button outside the form container */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FormWithExport;
