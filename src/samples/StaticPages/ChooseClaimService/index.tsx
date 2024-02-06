import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import Button from '../../../components/BaseComponents/Button/Button';
import StaticPageErrorSummary from '../ErrorSummary';
import { error } from '@pega/pcore-pconnect-typedefs/store/state/actions/action-creators';

export default function RecentlyClaimedChildBenefit() {
  const { t } = useTranslation();
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState('');

  const radioOptions = [
    {
      value: 'makeanewclaim',
      label: t('MAKE_A_NEW_CLAIM')
    },
    {
      value: 'addchildtoexistingclaim',
      label: t('ADD_CHILD_TO_EXISTING_CLAIM')
    },
    {
      value: 'checkonprogressofclaim',
      label: t('CHECK_PROGRESS_OF_CLAIM')
    },
    {
      value: 'restartyourpayments',
      label: t('RESTART_YOUR_PAYMENTS')
    },
    {
      value: 'stopyourpayments',
      label: t('STOP_YOUR_PAYMENTS')
    }
  ];

  function routeToService() {
    const selectedOption = document.querySelector('input[name="serviceType"]:checked');
    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      switch (selectedOptionValue) {
        case 'makeanewclaim':
          break;
        case 'addchildtoexistingclaim':
          break;
        case 'checkonprogressofclaim':
          history.push('/check-on-claim');
          break;
        case 'restartyourpayments':
          window.location.assign(
            'https://www.gov.uk/child-benefit-tax-charge/restart-child-benefit'
          );
          break;
        case 'stopyourpayments':
          window.location.assign('https://www.gov.uk/child-benefit-tax-charge/stop-child-benefit');
          break;
        default:
          break;
      }
    } else {
      setErrorMsg(t('CONFIRM_YOUR_SERVICE'));
    }
  }
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <Button
          variant='backlink'
          onClick={() => history.goBack()}
          key='RecentlyClaimedBacklink'
          attributes={{ type: 'link' }}
        />
        <MainWrapper>
          {errorMsg && errorMsg.length > 0 && (
            <StaticPageErrorSummary
              errorSummary={errorMsg}
              linkHref={`#serviceType`}
            ></StaticPageErrorSummary>
          )}
          <RadioButtons
            name='serviceType'
            displayInline={false}
            value=''
            useSmallRadios={false}
            options={radioOptions}
            label={t('MAKE_SURE_YOU_USE_RIGHT_CHBS')}
            legendIsHeading
            hintText={`<p class="govuk-body">${t('CONFIRM_YOUR_SERVICE')}</p>`}
            errorText={errorMsg}
          ></RadioButtons>
          <button
            className='govuk-button'
            data-module='govuk-button'
            onClick={routeToService}
            type='button'
            style={{ display: 'block', marginBottom: '50px' }}
          >
            {t('CONTINUE')}
          </button>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
