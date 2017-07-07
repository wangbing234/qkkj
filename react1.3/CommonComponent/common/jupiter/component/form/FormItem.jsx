import React, { PropTypes } from 'react'
import classnames from 'classnames'
import './FormItem.less'

const FormItem = React.createClass({

  getInitialState() {
    return {
      error: null  
    }
  },

  getChildContext() {
    return {
      formItem: this
    }
  },

  componentWillMount() {
    this.context.form.addItem(this)
  },
  componentDidMount(){
    $(function () {
        $('[data-toggle="popover"]').popover({trigger:"manual"});
    })
  },

  componentWillUnmount() {
    this.context.form.removeItem(this)
  },

  validate(value) {
    const rules = this.context.form.props.rules
    const rule = rules && rules[this.props.name]
    let isValid = true
    if (rule) {
      const error = rule(value)
      if (error && typeof error === 'string') {
        isValid = false;
      }
      this.setState({ error })
    }
    return isValid
  },

  tipClick(e){
    if(this.props.tipString){
      $(e.target).parent().find(".popover").show();
      $(e.target).parent().find(".popover").removeClass("error-popover");
      $(e.target).parent().find(".popover").addClass("tip-popover");
    }else{
      $(e.target).parent().find(".popover").hide();
    }
  },

  render() {
    const { error } = this.state
    const { name, multiple, required, help, label, className, children, tipString,...other } = this.props
    const labelWidth = this.context.form.props.labelWidth

    let Help
    if (help) {
      Help = (
        <div className="tip help">
          <span className="glyphicon glyphicon-question-sign"></span>
          {help}
        </div>
      )
    }

    let Error
    if (error) {
      Error = (
        <div className="tip error">
          <span className="glyphicon glyphicon-exclamation-sign"></span>
          {error}
        </div>
      )
    }
    let spanId = `span${name}`;
    let tipStr = "";
    if(error){
      tipStr = error;
      $(this.refs[spanId]).popover('show');
      $(this).find(".popover").removeClass("tip-popover");
      $(this).find(".popover").addClass("error-popover");
    }else if(tipString){
      tipStr = tipString;
      $(this.refs[spanId]).popover('show');
      $(this).find(".popover").removeClass("error-popover");
      $(this).find(".popover").addClass("tip-popover");
    }else{
      $(this.refs[spanId]).popover('hide');
    }
    return (
      <div className={classnames('form-group bfd-form-item2', className, {'has-error': error})} {...other}>
      { label ? <div className={classnames('form-label', { required })} style={{width: labelWidth + 'px'}}>{label}：</div> : null }
        <div className="form-content" style={{marginLeft: labelWidth + 'px'}}>
          <span ref={spanId} data-container="body" data-toggle="popover" data-placement="bottom"
                data-content={tipStr} onClick={this.tipClick}>
            {children}
          </span>
        </div>
      </div>
    )
  }
})

FormItem.contextTypes = {
  form: PropTypes.object
}

FormItem.childContextTypes = {
  formItem: PropTypes.instanceOf(FormItem)
}

FormItem.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  help: PropTypes.string,
  multiple: PropTypes.bool
}

export default FormItem