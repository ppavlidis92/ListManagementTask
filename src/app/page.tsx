'use client';

import React, { useState } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';
import {
  pdf,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for the PDF form layout
const styles = StyleSheet.create({
  formSection: {
    marginBottom: 10,
  },
  fieldLabel: {
    marginBottom: 5,
    fontSize: 12,
  },
  textField: {
    borderBottom: '1px solid black',
    paddingBottom: 3,
    fontSize: 12,
  },
  checkboxField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    width: 12,
    height: 12,
    border: '1px solid black',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFieldLabel: {
    fontSize: 12,
  },
});

const FormWithExport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    acceptTerms: false,
    subscribeNewsletter: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleExportPDF = () => {
    const MyDocument = (
      <Document>
        <Page size="A4" style={{ padding: 20 }}>
          <View>
            {/* Name field */}
            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Name:</Text>
              <View style={styles.textField}>
                <Text>{formData.name || '____________________'}</Text>
              </View>
            </View>

            {/* Email field */}
            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <View style={styles.textField}>
                <Text>{formData.email || '____________________'}</Text>
              </View>
            </View>

            {/* Accept Terms checkbox */}
            <View style={styles.checkboxField}>
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: formData.acceptTerms ? 'black' : 'white',
                  },
                ]}
              />
              <Text style={styles.textFieldLabel}>Accept Terms</Text>
            </View>

            {/* Subscribe to Newsletter checkbox */}
            <View style={styles.checkboxField}>
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: formData.subscribeNewsletter
                      ? 'black'
                      : 'white',
                  },
                ]}
              />
              <Text style={styles.textFieldLabel}>Subscribe to Newsletter</Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    pdf(MyDocument)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'form.pdf';
        link.click();
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Complete the form and export as PDF
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.acceptTerms}
              onChange={handleChange}
              name="acceptTerms"
            />
          }
          label="Accept Terms"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.subscribeNewsletter}
              onChange={handleChange}
              name="subscribeNewsletter"
            />
          }
          label="Subscribe to Newsletter"
        />
        <Button variant="contained" color="primary" onClick={handleExportPDF}>
          Export as PDF
        </Button>
      </Box>
    </Container>
  );
};

export default FormWithExport;
