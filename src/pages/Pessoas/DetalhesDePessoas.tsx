import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, LinearProgress, Paper, Typography } from '@mui/material';

import { LayoutDefault } from '../../shared/layouts';
import { VForm, VTextField, useVForm, IVFormErrors } from '../../shared/forms';
import { PessoasServices } from '../../shared/services/api/pessoas/PessoasServises';
import { AutoCompleteCidade, BarraDeFerramentasDeDetalhes } from '../../shared/components';
import * as yup from 'yup'


interface IFormData {
  email: string;
  cityId: number
  completeName: string;
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  completeName: yup.string().required().min(3),
  email: yup.string().required().email(),
  cityId: yup.number().required(),
});

export const DetalhesDePessoas: React.FC = () => {
  const { FormRef, save, IsSaveAndClose, saveAndClose } = useVForm();
  const [isLoading, setIsLoading] = useState(false);
  const { id = 'nova' } = useParams<'id'>();
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true)
    if (id !== 'nova') {
      PessoasServices.getById(Number(id))
        .then(result => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/pessoas/');
          } else {
            setTitle(result.completeName)
            FormRef.current?.setData(result)
          }
        })
    } else {
      setIsLoading(false);
      FormRef.current?.setData({
        completeName: '',
        email: '',
        cityId: '' 
      });
    }
  }, [id]);

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PessoasServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message)
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/pessoas/')
          }
        });
    }
  };

  const handleSave = (dados: IFormData) => {
    console.log(dados);
    
    formValidationSchema.validate(dados, { abortEarly: false })
      .then((validatedDados) => {
        setIsLoading(true);
        if (id === 'nova') {
          PessoasServices.create(validatedDados)
            .then(result => {
              setIsLoading(false)
              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (IsSaveAndClose.current) {
                  navigate(`/pessoas/`)
                } else {
                  navigate(`/pessoas/detalhe/${result}`)
                }
              }

            });
        } else {
          PessoasServices.updateById(Number(id), { id: Number(id), ...validatedDados })
            .then(result => {
              setIsLoading(false);

              if (result instanceof Error) {
                console.log(result)
                alert(result.message);
              } else {
                if (IsSaveAndClose.current) {
                  navigate(`/pessoas/`)
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validarionErrors: IVFormErrors = {};
        errors.inner.forEach(error => {
          if (!error.path) return;
          validarionErrors[error.path] = error.message;
        });

        FormRef.current?.setErrors(validarionErrors);
      });
  }

  return (
    <LayoutDefault
      title={id == 'nova' ? 'Nova Pessoa' : `${title}`}
      toolBar={
        <BarraDeFerramentasDeDetalhes
          showBtnSaveAndBack
          showSkeletons
          showBtnNew={id !== 'nova'}
          showBtnDelete={id !== 'nova'}
          textNewBtn='Nova'

          onClickSave={save}
          onClickSaveAndBack={saveAndClose}
          onClickBack={() => navigate('/pessoas/')}
          onClickDelete={() => handleDelete(Number(id))}
          onClickNew={() => navigate('/pessoas/detalhe/nova')}
        />}>

      <VForm ref={FormRef} onSubmit={handleSave} >
        <Box
          margin={1}
          display='flex'
          flexDirection='column'
          component={Paper}
          variant='outlined'
        >
          <Grid container direction={'column'} padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>
                Geral
              </Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  label='Digite o nome completo'
                  name='completeName'
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading} />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
                <VTextField
                  label='Digite um E-mail valido'
                  name='email'
                  fullWidth
                  disabled={isLoading} />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteCidade isExternalLoading={isLoading} />
              </Grid>
            </Grid>

          </Grid>
        </Box>
      </VForm>

    </LayoutDefault>
  )
}
