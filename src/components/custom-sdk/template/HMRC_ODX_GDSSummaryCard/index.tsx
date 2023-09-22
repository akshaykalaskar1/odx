
import React, { ReactNode, useEffect, useState, Fragment } from 'react';
import { Grid} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GBdate } from '../../../helpers/utils';

import StyledHmrcOdxGdsSummaryCardWrapper from './styles';

export default function HmrcOdxGdsSummaryCard(props) {
  const {
    children,
    NumCols,
    sectionHeader,
    getPConnect,
    useType = 1
  } = props;

  const containerItemID = getPConnect().getContextName();

  const { t } = useTranslation();

  const nCols = parseInt( NumCols,8 );
  const [formElms, setFormElms] = useState<Array<ReactNode>>([]); // Initialize as an empty array of React Nodes

  let itemName;
  if(useType === 1) {
    itemName = t('GDS_INFO_ITEM_CHILD');
  }

  useEffect(() => {
    const elms : Array<string> = [];
    let finalELms : Array<string> = [];
    const region = children[0] ? children[0].props.getPConnect() : null;

    if (region?.getChildren()) {
      region.getChildren().forEach(child => {
        child.getPConnect().setInheritedProp('readOnly', true);
        elms.push(child.getPConnect().getComponent());
        finalELms = elms.slice(0, -1);
      });

      setFormElms(finalELms);

    }
  }, [children[0]]);

   const handleOnClick = (action: string) => {
    switch (action) {
      case t('GDS_ACTION_REMOVE'):
        getPConnect().setValue(".UserActions", "Remove");
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      case t('GDS_ACTION_CHANGE'):
        getPConnect().setValue(".UserActions", "Amend");
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      default:
        break;
    }
  };

  return (
    <StyledHmrcOdxGdsSummaryCardWrapper>
      <h2>{sectionHeader}</h2>
      <Grid
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        <div className="govuk-summary-card">
          <div className="govuk-summary-card__title-wrapper">
            <h2 className="govuk-summary-card__title">{itemName}</h2>
            <ul className="govuk-summary-card__actions">
              <li className="govuk-summary-card__action"> <a className="govuk-link" href="#" onClick={() => handleOnClick(t('GDS_ACTION_REMOVE'))}>
                  {t('GDS_ACTION_REMOVE')}<span className="govuk-visually-hidden"> {itemName}</span>
                </a>
              </li>
              <li className="govuk-summary-card__action"> <a className="govuk-link" href="#" onClick={() => handleOnClick(t('GDS_ACTION_CHANGE'))}>
                  {t('GDS_ACTION_CHANGE')}<span className="govuk-visually-hidden"> {itemName}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="govuk-summary-card__content">
            <dl className='govuk-summary-list'>
              {formElms.map((field, index) => {

                let formattedValue = "";

                formattedValue = ((field as any)?.props?.label === 'Date of birth' || (field as any)?.props?.label === 'Dyddiad geni')? // TODO: Need to make more robust
                  GBdate((field as any)?.props?.value)
                : (field as any)?.props?.value;

                const key = new Date().getTime()+index;

                return (
                  <Fragment key={key}>
                    <div className="govuk-summary-list__row">
                      <dt className="govuk-summary-list__key">
                        {(field as any).props.label}
                      </dt>
                      <dd className="govuk-summary-list__value">
                        {formattedValue}
                      </dd>
                    </div>
                  </Fragment>
                );
              })}
            </dl>
          </div>
        </div>
      </Grid>
    </StyledHmrcOdxGdsSummaryCardWrapper>
  );
}

HmrcOdxGdsSummaryCard.defaultProps = {
  NumCols: 1
};

HmrcOdxGdsSummaryCard.propTypes = {
  sectionHeader: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  NumCols: PropTypes.number
};