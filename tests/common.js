import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { updateNewInstuctions } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';
import { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import { useTranslation } from 'react-i18next';

interface HmrcOdxGoBackGoBackProps extends Omit<PConnFieldProps, 'value'> {
  value?: boolean;
  caption?: string;
  selectionList?: any;
  referenceList: string;
}

export default function HmrcOdxGoBackGoBack(props: HmrcOdxGoBackGoBackProps) {
  const { getPConnect, caption, value, readOnly, testId, disabled, selectionList, referenceList } =
    props;

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = (thePConn.getStateProps() as any).value;
  const { t } = useTranslation();
  const [checked, setChecked] = useState<any>(false);
  const [clickable, setClickable] = useState(true);
  const [overrideControl, setOverrideControl] = useState(false);

  function customAssignmentFinished() {
    // resetting control on click of 'Continue'
    sessionStorage.setItem('overrideControl', 'false');
  }

  PCore.getPubSubUtils().subscribe(
    'CustomAssignmentFinished',
    customAssignmentFinished,
    'CustomAssignmentFinished'
  );

  useEffect(() => {
    const assignmentDiv = document.getElementById('Assignment');
    const mainContent = document.getElementById('main-content');

    if (String(value) === 'true') {
      // React control
      setChecked(false);
      // setOverrideControl(true);
      sessionStorage.setItem('overrideControl', 'true');
      handleEvent(actionsApi, 'changeNblur', propName, 'false');

      if (assignmentDiv && mainContent) {
        const existingBackLinks = document.querySelectorAll('.govuk-back-link');
        existingBackLinks.forEach(link => link.remove());

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.className = 'govuk-back-link';
        backLink.innerText = t('BACK_R');
        backLink.id = 'dynamic-back-link';

        backLink.addEventListener('click', (event: MouseEvent) => {
          event.preventDefault();
          if (!clickable) return;
          setClickable(false);

          // const saveAmdCompleteLater = document.querySelector(
          //   '.govuk-button-group .govuk-link'
          // ) as HTMLElement;
          // if (saveAmdCompleteLater) {
          //   saveAmdCompleteLater.click();
          // }
          PCore.getPubSubUtils().publish('CUSTOM_EVENT_BACK', {});
        });

        assignmentDiv.insertAdjacentElement('beforebegin', backLink);
      }
    } else {
      // Pega control
      if (sessionStorage.getItem('overrideControl') === 'true') return;

      // setOverrideControl(false);
      sessionStorage.setItem('overrideControl', 'false');

      if (assignmentDiv && mainContent) {
        const existingBackLinks = document.querySelectorAll('.govuk-back-link');
        existingBackLinks.forEach(link => link.remove());

        const backLink = document.createElement('a');
        backLink.href = '#';
        backLink.className = 'govuk-back-link';
        backLink.innerText = t('BACK');
        backLink.id = 'dynamic-back-link';

        backLink.addEventListener('click', (event: MouseEvent) => {
          event.preventDefault();
          if (!clickable) return;
          setClickable(false);

          setChecked(true);
          handleEvent(actionsApi, 'changeNblur', propName, 'true');

          const continueButton = document.querySelector('.govuk-button') as HTMLElement;
          if (continueButton) {
            continueButton.click();
          }
        });

        assignmentDiv.insertAdjacentElement('beforebegin', backLink);
      }
    }
  }, []);

  useEffect(() => {
    if (referenceList?.length > 0) {
      thePConn.setReferenceList(selectionList);
      updateNewInstuctions(thePConn, selectionList);
    }
  }, [thePConn]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (overrideControl) return;
    const isChecked = event.target.checked;
    setChecked(isChecked);
    handleEvent(actionsApi, 'changeNblur', propName, isChecked.toString());
  };

  const theCheckbox = (
    <FormControlLabel
      control={
        <Checkbox
          id='GoBackCheckBox'
          color='primary'
          checked={checked}
          onChange={!readOnly ? handleCheckboxChange : undefined}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          aria-hidden='true'
          tabIndex={-1}
        />
      }
      label={caption}
      labelPlacement='end'
      data-test-id={testId}
      aria-hidden='true'
      tabIndex={-1}
    />
  );

  return (
    <div className='govuk-visually-hidden' aria-hidden='true' tabIndex={-1}>
      <FormGroup tabIndex={-1} aria-hidden='true'>
        {
        // !overrideControl && 
        theCheckbox}
      </FormGroup>
    </div>
  );
}
