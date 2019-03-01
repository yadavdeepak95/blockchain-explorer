/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { shape, string } from 'prop-types';

import { authSelectors, authOperations } from '../../state/redux/auth';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  container: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  actions: {
    marginTop: theme.spacing.unit * 3
  }
});

export class Register extends Component {
  static propTypes = {
    classes: shape({
      form: string,
      container: string,
      paper: string,
      actions: string
    }).isRequired
  };

  constructor(props) {
    super(props);
    const { registered } = props;
    this.state = {
      enrollmentID: {
        error: null,
        value: ''
      },
      enrollmentSecret: {
        error: null,
        value: ''
      },
      role: {
        error: null,
        value: ''
      },
      affiliation: {
        error: null,
        value: ''
      },
      maxEnrollments: {
        error: null,
        value: ''
      },
      attrs: {
        error: null,
        value: ''
      },
      roles: ['admin', 'reader', 'user'],
      error: '',
      registered,
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { registered = [], error } = nextProps;
    this.setState(() => ({
      registered,
      error
    }));
  }

  handleChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: { value }
    });
  };

  submitForm = async e => {
    e.preventDefault();

    const { register, onRegister } = this.props;
    const {
      enrollmentID,
      enrollmentSecret,
      role,
      affiliation,
      maxEnrollments,
      attrs
    } = this.state;

    const user = {
      enrollmentID: enrollmentID.value,
      enrollmentSecret: enrollmentSecret.value,
      role: role.value,
      affiliation: affiliation.value,
      maxEnrollments: maxEnrollments.value,
      attrs: attrs.value
    };

    await register(user);

    onRegister(user);

    return true;
  };

  render() {
    const {
      enrollmentID,
      enrollmentSecret,
      role,
      roles,
      affiliation,
      maxEnrollments,
      attrs,
      isLoading
    } = this.state;
    const { classes, error, onClose } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Typography
            className={classes.title}
            component="h5"
            variant="headline"
          >
            Register User
          </Typography>
          <form className={classes.form} onSubmit={this.submitForm}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                id="enrollmentID"
                name="enrollmentID"
                label="Enrollment ID"
                disabled={isLoading}
                value={enrollmentID.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {enrollmentID.error && (
                <FormHelperText id="component-error-text" error>
                  {enrollmentID.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!enrollmentSecret.error}
                id="enrollmentSecret"
                type="enrollmentSecret"
                name="enrollmentSecret"
                label="Enrollment Secret"
                disabled={isLoading}
                value={enrollmentSecret.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {enrollmentSecret.error && (
                <FormHelperText id="component-error-text" error>
                  {enrollmentSecret.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                select
                id="role"
                name="role"
                label="Role"
                disabled={isLoading}
                value={role.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              >
                {roles.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              {role.error && (
                <FormHelperText id="component-error-text" error>
                  {role.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                error={!!affiliation.error}
                required
                fullWidth
                id="affiliation"
                name="affiliation"
                label="Affiliation"
                disabled={isLoading}
                value={affiliation.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {affiliation.error && (
                <FormHelperText id="component-error-text" error>
                  {affiliation.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!maxEnrollments.error}
                id="maxEnrollments"
                type="maxEnrollments"
                name="maxEnrollments"
                label="Max Enrollments"
                disabled={isLoading}
                value={maxEnrollments.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {maxEnrollments.error && (
                <FormHelperText id="component-error-text" error>
                  {maxEnrollments.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!attrs.error}
                id="attrs"
                type="attrs"
                name="attrs"
                label="Attrs"
                disabled={isLoading}
                value={attrs.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {attrs.error && (
                <FormHelperText id="component-error-text" error>
                  {attrs.error}
                </FormHelperText>
              )}
            </FormControl>
            {error && (
              <FormHelperText id="component-error-text" error>
                {error}
              </FormHelperText>
            )}
            <Grid
              container
              spacing={16}
              direction="row"
              justify="flex-end"
              className={classes.actions}
            >
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

const { errorSelector, registeredSelector } = authSelectors;

export default compose(
  withStyles(styles),
  connect(
    state => ({
      registered: registeredSelector(state),
      error: errorSelector(state)
    }),
    {
      register: authOperations.register
    }
  )
)(Register);
